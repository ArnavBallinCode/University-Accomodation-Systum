package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/go-sql-driver/mysql"

	"uni-accom-api/models"
)

type StudentRepository struct {
	db *sql.DB
}

func NewStudentRepository(db *sql.DB) *StudentRepository {
	return &StudentRepository{db: db}
}

func (r *StudentRepository) GetStudents(ctx context.Context) ([]models.Student, error) {
	query := `
        SELECT
            banner_id,
            name,
            address,
            phone,
            email,
            dob,
            gender,
            category,
            nationality,
            special_needs,
            comments,
            status,
            major,
            minor,
            advisor_staff_id
        FROM students
        ORDER BY banner_id
    `

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query students: %w", err)
	}
	defer rows.Close()

	students := make([]models.Student, 0)
	for rows.Next() {
		student, err := scanStudent(rows)
		if err != nil {
			return nil, err
		}
		students = append(students, student)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate students: %w", err)
	}

	return students, nil
}

func (r *StudentRepository) CreateStudent(ctx context.Context, student models.Student) error {
	query := `
        INSERT INTO students (
            banner_id,
            name,
            address,
            phone,
            email,
            dob,
            gender,
            category,
            nationality,
            special_needs,
            comments,
            status,
            major,
            minor,
            advisor_staff_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

	_, err := r.db.ExecContext(
		ctx,
		query,
		student.BannerID,
		student.Name,
		student.Address,
		valueOrNil(student.Phone),
		valueOrNil(student.Email),
		student.DOB,
		student.Gender,
		student.Category,
		student.Nationality,
		valueOrNil(student.SpecialNeeds),
		valueOrNil(student.Comments),
		student.Status,
		student.Major,
		valueOrNil(student.Minor),
		int64ValueOrNil(student.AdvisorStaffID),
	)
	if err != nil {
		return fmt.Errorf("create student: %w", err)
	}

	return nil
}

func (r *StudentRepository) GetStudentByID(ctx context.Context, bannerID string) (*models.Student, error) {
	query := `
        SELECT
            banner_id,
            name,
            address,
            phone,
            email,
            dob,
            gender,
            category,
            nationality,
            special_needs,
            comments,
            status,
            major,
            minor,
            advisor_staff_id
        FROM students
        WHERE banner_id = ?
    `

	row := r.db.QueryRowContext(ctx, query, bannerID)
	student, err := scanStudent(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &student, nil
}

func IsDuplicateKeyError(err error) bool {
	var mysqlErr *mysql.MySQLError
	return errors.As(err, &mysqlErr) && mysqlErr.Number == 1062
}

func IsForeignKeyError(err error) bool {
	var mysqlErr *mysql.MySQLError
	return errors.As(err, &mysqlErr) && mysqlErr.Number == 1452
}

type rowScanner interface {
	Scan(dest ...any) error
}

func scanStudent(scanner rowScanner) (models.Student, error) {
	var student models.Student
	var phone sql.NullString
	var email sql.NullString
	var specialNeeds sql.NullString
	var comments sql.NullString
	var minor sql.NullString
	var advisorStaffID sql.NullInt64

	if err := scanner.Scan(
		&student.BannerID,
		&student.Name,
		&student.Address,
		&phone,
		&email,
		&student.DOB,
		&student.Gender,
		&student.Category,
		&student.Nationality,
		&specialNeeds,
		&comments,
		&student.Status,
		&student.Major,
		&minor,
		&advisorStaffID,
	); err != nil {
		return models.Student{}, fmt.Errorf("scan student: %w", err)
	}

	student.Phone = nullStringPtr(phone)
	student.Email = nullStringPtr(email)
	student.SpecialNeeds = nullStringPtr(specialNeeds)
	student.Comments = nullStringPtr(comments)
	student.Minor = nullStringPtr(minor)
	student.AdvisorStaffID = nullInt64Ptr(advisorStaffID)

	return student, nil
}

func nullStringPtr(value sql.NullString) *string {
	if !value.Valid {
		return nil
	}

	result := value.String
	return &result
}

func nullInt64Ptr(value sql.NullInt64) *int64 {
	if !value.Valid {
		return nil
	}

	result := value.Int64
	return &result
}

func valueOrNil(value *string) any {
	if value == nil {
		return nil
	}

	return *value
}

func int64ValueOrNil(value *int64) any {
	if value == nil {
		return nil
	}

	return *value
}
