package models

import "time"

type Student struct {
	BannerID       string    `json:"banner_id"`
	Name           string    `json:"name"`
	Address        string    `json:"address"`
	Phone          *string   `json:"phone,omitempty"`
	Email          *string   `json:"email,omitempty"`
	DOB            time.Time `json:"dob"`
	Gender         string    `json:"gender"`
	Category       string    `json:"category"`
	Nationality    string    `json:"nationality"`
	SpecialNeeds   *string   `json:"special_needs,omitempty"`
	Comments       *string   `json:"comments,omitempty"`
	Status         string    `json:"status"`
	Major          string    `json:"major"`
	Minor          *string   `json:"minor,omitempty"`
	AdvisorStaffID *int64    `json:"advisor_staff_id,omitempty"`
}

type Staff struct {
	StaffID    int64      `json:"staff_id"`
	Name       string     `json:"name"`
	Position   string     `json:"position"`
	Department string     `json:"department"`
	Phone      *string    `json:"phone,omitempty"`
	Email      string     `json:"email"`
	Location   string     `json:"location"`
	Address    *string    `json:"address,omitempty"`
	DOB        *time.Time `json:"dob,omitempty"`
	Gender     *string    `json:"gender,omitempty"`
}

type Hall struct {
	HallID    int64  `json:"hall_id"`
	Name      string `json:"name"`
	Address   string `json:"address"`
	Telephone string `json:"telephone"`
	ManagerID int64  `json:"manager_id"`
}

type Apartment struct {
	ApartmentID  int64  `json:"apartment_id"`
	Address      string `json:"address"`
	NumberOfBeds int    `json:"number_of_beds"`
}

type Room struct {
	PlaceNumber int64   `json:"place_number"`
	RoomNumber  string  `json:"room_number"`
	MonthlyRent float64 `json:"monthly_rent"`
	HallID      *int64  `json:"hall_id,omitempty"`
	ApartmentID *int64  `json:"apartment_id,omitempty"`
}

type Lease struct {
	LeaseID     int64      `json:"lease_id"`
	BannerID    string     `json:"banner_id"`
	PlaceNumber int64      `json:"place_number"`
	Duration    string     `json:"duration"`
	DateEnter   time.Time  `json:"date_enter"`
	DateLeave   *time.Time `json:"date_leave,omitempty"`
}

type Invoice struct {
	InvoiceID          int64      `json:"invoice_id"`
	LeaseID            int64      `json:"lease_id"`
	Semester           string     `json:"semester"`
	AmountDue          float64    `json:"amount_due"`
	DatePaid           *time.Time `json:"date_paid,omitempty"`
	PaymentMethod      *string    `json:"payment_method,omitempty"`
	FirstReminderDate  *time.Time `json:"first_reminder_date,omitempty"`
	SecondReminderDate *time.Time `json:"second_reminder_date,omitempty"`
}

type NextOfKin struct {
	KinID        int64  `json:"kin_id"`
	BannerID     string `json:"banner_id"`
	Name         string `json:"name"`
	Relationship string `json:"relationship"`
	Address      string `json:"address"`
	Phone        string `json:"phone"`
}

type Inspection struct {
	InspectionID    int64     `json:"inspection_id"`
	ApartmentID     int64     `json:"apartment_id"`
	StaffID         int64     `json:"staff_id"`
	InspectionDate  time.Time `json:"inspection_date"`
	ConditionStatus string    `json:"condition_status"`
	Comments        *string   `json:"comments,omitempty"`
}

type HallManagerReport struct {
	HallID       int64  `json:"hall_id"`
	HallName     string `json:"hall_name"`
	ManagerName  string `json:"manager_name"`
	ManagerPhone string `json:"manager_phone"`
}

type StudentLeaseReport struct {
	LeaseID          int64      `json:"lease_id"`
	BannerID         string     `json:"banner_id"`
	StudentName      string     `json:"student_name"`
	Duration         string     `json:"duration"`
	DateEnter        time.Time  `json:"date_enter"`
	DateLeave        *time.Time `json:"date_leave,omitempty"`
	PlaceNumber      int64      `json:"place_number"`
	RoomNumber       string     `json:"room_number"`
	MonthlyRent      float64    `json:"monthly_rent"`
	ResidenceType    string     `json:"residence_type"`
	ResidenceName    string     `json:"residence_name"`
	ResidenceAddress string     `json:"residence_address"`
}

type UnpaidInvoiceReport struct {
	InvoiceID        int64   `json:"invoice_id"`
	LeaseID          int64   `json:"lease_id"`
	BannerID         string  `json:"banner_id"`
	StudentName      string  `json:"student_name"`
	Semester         string  `json:"semester"`
	AmountDue        float64 `json:"amount_due"`
	PlaceNumber      int64   `json:"place_number"`
	RoomNumber       string  `json:"room_number"`
	ResidenceType    string  `json:"residence_type"`
	ResidenceAddress string  `json:"residence_address"`
}

type RentStats struct {
	MinRent *float64 `json:"min_rent"`
	MaxRent *float64 `json:"max_rent"`
	AvgRent *float64 `json:"avg_rent"`
}
