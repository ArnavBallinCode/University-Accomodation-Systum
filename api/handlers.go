package api

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"uni-accom-api/models"
	"uni-accom-api/repository"
)

type StudentStore interface {
	GetStudents(ctx context.Context) ([]models.Student, error)
	CreateStudent(ctx context.Context, student models.Student) error
	GetStudentByID(ctx context.Context, bannerID string) (*models.Student, error)
}

type ReportStore interface {
	GetHallManagers(ctx context.Context) ([]models.HallManagerReport, error)
	GetStudentLeases(ctx context.Context) ([]models.StudentLeaseReport, error)
	GetUnpaidInvoices(ctx context.Context) ([]models.UnpaidInvoiceReport, error)
	GetRentStats(ctx context.Context) (models.RentStats, error)
}

type Handler struct {
	students StudentStore
	reports  ReportStore
}

func NewHandler(students StudentStore, reports ReportStore) *Handler {
	return &Handler{
		students: students,
		reports:  reports,
	}
}

func (h *Handler) RegisterRoutes(router *gin.Engine) {
	apiGroup := router.Group("/api")
	{
		apiGroup.GET("/students", h.GetStudents)
		apiGroup.POST("/students", h.CreateStudent)

		reports := apiGroup.Group("/reports")
		reports.GET("/hall-managers", h.GetHallManagers)
		reports.GET("/student-leases", h.GetStudentLeases)
		reports.GET("/unpaid-invoices", h.GetUnpaidInvoices)
		reports.GET("/rent-stats", h.GetRentStats)
	}
}

type createStudentRequest struct {
	BannerID       string  `json:"banner_id" binding:"required"`
	Name           string  `json:"name" binding:"required"`
	Address        string  `json:"address" binding:"required"`
	Phone          *string `json:"phone"`
	Email          *string `json:"email"`
	DOB            string  `json:"dob" binding:"required"`
	Gender         string  `json:"gender" binding:"required"`
	Category       string  `json:"category" binding:"required"`
	Nationality    string  `json:"nationality" binding:"required"`
	SpecialNeeds   *string `json:"special_needs"`
	Comments       *string `json:"comments"`
	Status         string  `json:"status" binding:"required,oneof=Placed Waiting"`
	Major          string  `json:"major" binding:"required"`
	Minor          *string `json:"minor"`
	AdvisorStaffID *int64  `json:"advisor_staff_id"`
}

func (h *Handler) GetStudents(c *gin.Context) {
	students, err := h.students.GetStudents(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load students"})
		return
	}

	c.JSON(http.StatusOK, students)
}

func (h *Handler) CreateStudent(c *gin.Context) {
	var request createStudentRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student payload"})
		return
	}

	dob, err := time.Parse("2006-01-02", request.DOB)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dob must use YYYY-MM-DD format"})
		return
	}

	student := models.Student{
		BannerID:       strings.TrimSpace(request.BannerID),
		Name:           strings.TrimSpace(request.Name),
		Address:        strings.TrimSpace(request.Address),
		Phone:          normalizeOptionalString(request.Phone),
		Email:          normalizeOptionalString(request.Email),
		DOB:            dob,
		Gender:         strings.TrimSpace(request.Gender),
		Category:       strings.TrimSpace(request.Category),
		Nationality:    strings.TrimSpace(request.Nationality),
		SpecialNeeds:   normalizeOptionalString(request.SpecialNeeds),
		Comments:       normalizeOptionalString(request.Comments),
		Status:         strings.TrimSpace(request.Status),
		Major:          strings.TrimSpace(request.Major),
		Minor:          normalizeOptionalString(request.Minor),
		AdvisorStaffID: request.AdvisorStaffID,
	}

	if err := h.students.CreateStudent(c.Request.Context(), student); err != nil {
		switch {
		case repository.IsDuplicateKeyError(err):
			c.JSON(http.StatusConflict, gin.H{"error": "student with this banner_id already exists"})
		case repository.IsForeignKeyError(err):
			c.JSON(http.StatusBadRequest, gin.H{"error": "advisor_staff_id does not reference an existing staff member"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create student"})
		}
		return
	}

	c.JSON(http.StatusCreated, student)
}

func (h *Handler) GetHallManagers(c *gin.Context) {
	reports, err := h.reports.GetHallManagers(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load hall manager report"})
		return
	}

	c.JSON(http.StatusOK, reports)
}

func (h *Handler) GetStudentLeases(c *gin.Context) {
	reports, err := h.reports.GetStudentLeases(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load student lease report"})
		return
	}

	c.JSON(http.StatusOK, reports)
}

func (h *Handler) GetUnpaidInvoices(c *gin.Context) {
	reports, err := h.reports.GetUnpaidInvoices(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load unpaid invoice report"})
		return
	}

	c.JSON(http.StatusOK, reports)
}

func (h *Handler) GetRentStats(c *gin.Context) {
	stats, err := h.reports.GetRentStats(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load rent statistics"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func normalizeOptionalString(value *string) *string {
	if value == nil {
		return nil
	}

	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil
	}

	return &trimmed
}
