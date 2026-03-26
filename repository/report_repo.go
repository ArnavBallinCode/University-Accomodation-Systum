package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"uni-accom-api/models"
)

type ReportRepository struct {
	db *sql.DB
}

func NewReportRepository(db *sql.DB) *ReportRepository {
	return &ReportRepository{db: db}
}

func (r *ReportRepository) GetHallManagers(ctx context.Context) ([]models.HallManagerReport, error) {
	query := `
        SELECT
            h.hall_id,
            h.name,
            s.name,
            COALESCE(s.phone, '')
        FROM halls h
        JOIN staff s ON s.staff_id = h.manager_id
        ORDER BY h.hall_id
    `

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query hall managers: %w", err)
	}
	defer rows.Close()

	reports := make([]models.HallManagerReport, 0)
	for rows.Next() {
		var report models.HallManagerReport
		if err := rows.Scan(&report.HallID, &report.HallName, &report.ManagerName, &report.ManagerPhone); err != nil {
			return nil, fmt.Errorf("scan hall manager report: %w", err)
		}
		reports = append(reports, report)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate hall managers: %w", err)
	}

	return reports, nil
}

func (r *ReportRepository) GetStudentLeases(ctx context.Context) ([]models.StudentLeaseReport, error) {
	query := `
        SELECT
            l.lease_id,
            s.banner_id,
            s.name,
            l.duration,
            l.date_enter,
            l.date_leave,
            r.place_number,
            r.room_number,
            r.monthly_rent,
            CASE
                WHEN r.hall_id IS NOT NULL THEN 'Hall'
                ELSE 'Apartment'
            END AS residence_type,
            CASE
                WHEN r.hall_id IS NOT NULL THEN h.name
                ELSE CONCAT('Apartment ', a.apartment_id)
            END AS residence_name,
            COALESCE(h.address, a.address) AS residence_address
        FROM leases l
        JOIN students s ON s.banner_id = l.banner_id
        JOIN rooms r ON r.place_number = l.place_number
        LEFT JOIN halls h ON h.hall_id = r.hall_id
        LEFT JOIN apartments a ON a.apartment_id = r.apartment_id
        ORDER BY s.banner_id, l.lease_id
    `

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query student leases: %w", err)
	}
	defer rows.Close()

	reports := make([]models.StudentLeaseReport, 0)
	for rows.Next() {
		var report models.StudentLeaseReport
		var dateLeave sql.NullTime
		if err := rows.Scan(
			&report.LeaseID,
			&report.BannerID,
			&report.StudentName,
			&report.Duration,
			&report.DateEnter,
			&dateLeave,
			&report.PlaceNumber,
			&report.RoomNumber,
			&report.MonthlyRent,
			&report.ResidenceType,
			&report.ResidenceName,
			&report.ResidenceAddress,
		); err != nil {
			return nil, fmt.Errorf("scan student lease report: %w", err)
		}

		report.DateLeave = nullTimePtr(dateLeave)
		reports = append(reports, report)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate student leases: %w", err)
	}

	return reports, nil
}

func (r *ReportRepository) GetUnpaidInvoices(ctx context.Context) ([]models.UnpaidInvoiceReport, error) {
	query := `
        SELECT
            i.invoice_id,
            i.lease_id,
            s.banner_id,
            s.name,
            i.semester,
            i.amount_due,
            r.place_number,
            r.room_number,
            CASE
                WHEN r.hall_id IS NOT NULL THEN 'Hall'
                ELSE 'Apartment'
            END AS residence_type,
            COALESCE(h.address, a.address) AS residence_address
        FROM invoices i
        JOIN leases l ON l.lease_id = i.lease_id
        JOIN students s ON s.banner_id = l.banner_id
        JOIN rooms r ON r.place_number = l.place_number
        LEFT JOIN halls h ON h.hall_id = r.hall_id
        LEFT JOIN apartments a ON a.apartment_id = r.apartment_id
        WHERE i.date_paid IS NULL
        ORDER BY i.invoice_id
    `

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query unpaid invoices: %w", err)
	}
	defer rows.Close()

	reports := make([]models.UnpaidInvoiceReport, 0)
	for rows.Next() {
		var report models.UnpaidInvoiceReport
		if err := rows.Scan(
			&report.InvoiceID,
			&report.LeaseID,
			&report.BannerID,
			&report.StudentName,
			&report.Semester,
			&report.AmountDue,
			&report.PlaceNumber,
			&report.RoomNumber,
			&report.ResidenceType,
			&report.ResidenceAddress,
		); err != nil {
			return nil, fmt.Errorf("scan unpaid invoice report: %w", err)
		}
		reports = append(reports, report)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate unpaid invoices: %w", err)
	}

	return reports, nil
}

func (r *ReportRepository) GetRentStats(ctx context.Context) (models.RentStats, error) {
	query := `
        SELECT
            MIN(monthly_rent),
            MAX(monthly_rent),
            AVG(monthly_rent)
        FROM rooms
        WHERE hall_id IS NOT NULL
    `

	var minRent sql.NullFloat64
	var maxRent sql.NullFloat64
	var avgRent sql.NullFloat64

	if err := r.db.QueryRowContext(ctx, query).Scan(&minRent, &maxRent, &avgRent); err != nil {
		return models.RentStats{}, fmt.Errorf("query rent stats: %w", err)
	}

	return models.RentStats{
		MinRent: nullFloat64Ptr(minRent),
		MaxRent: nullFloat64Ptr(maxRent),
		AvgRent: nullFloat64Ptr(avgRent),
	}, nil
}

func nullTimePtr(value sql.NullTime) *time.Time {
	if !value.Valid {
		return nil
	}

	result := value.Time
	return &result
}

func nullFloat64Ptr(value sql.NullFloat64) *float64 {
	if !value.Valid {
		return nil
	}

	result := value.Float64
	return &result
}
