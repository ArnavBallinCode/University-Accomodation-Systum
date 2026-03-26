package config

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"fmt"
	"os"
	"time"

	"github.com/go-sql-driver/mysql"
)

func NewDB() (*sql.DB, error) {
	host, err := requiredEnv("DB_HOST")
	if err != nil {
		return nil, err
	}

	port, err := requiredEnv("DB_PORT")
	if err != nil {
		return nil, err
	}

	user, err := requiredEnv("DB_USER")
	if err != nil {
		return nil, err
	}

	password, err := requiredEnv("DB_PASSWORD")
	if err != nil {
		return nil, err
	}

	dbName, err := requiredEnv("DB_NAME")
	if err != nil {
		return nil, err
	}

	cfg := mysql.NewConfig()
	cfg.User = user
	cfg.Passwd = password
	cfg.Net = "tcp"
	cfg.Addr = fmt.Sprintf("%s:%s", host, port)
	cfg.DBName = dbName
	cfg.ParseTime = true
	cfg.Params = map[string]string{
		"charset":   "utf8mb4",
		"collation": "utf8mb4_unicode_ci",
	}

	tlsConfig, err := configureTLS()
	if err != nil {
		return nil, err
	}
	cfg.TLSConfig = tlsConfig

	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		return nil, fmt.Errorf("open mysql connection: %w", err)
	}

	db.SetConnMaxLifetime(5 * time.Minute)
	db.SetMaxIdleConns(5)
	db.SetMaxOpenConns(10)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("ping mysql connection: %w", err)
	}

	return db, nil
}

func requiredEnv(key string) (string, error) {
	value := os.Getenv(key)
	if value == "" {
		return "", fmt.Errorf("%s is required", key)
	}

	return value, nil
}

func configureTLS() (string, error) {
	mode := os.Getenv("DB_TLS_MODE")
	if mode == "" {
		mode = "preferred"
	}

	switch mode {
	case "false":
		return "false", nil
	case "skip-verify":
		const name = "aiven-skip-verify"
		if err := mysql.RegisterTLSConfig(name, &tls.Config{
			MinVersion:         tls.VersionTLS12,
			InsecureSkipVerify: true,
		}); err != nil {
			return "", fmt.Errorf("register skip-verify tls config: %w", err)
		}
		return name, nil
	case "preferred":
		caPath := os.Getenv("DB_CA_CERT_PATH")
		if caPath == "" {
			return "true", nil
		}

		caCert, err := os.ReadFile(caPath)
		if err != nil {
			return "", fmt.Errorf("read DB_CA_CERT_PATH: %w", err)
		}

		pool := x509.NewCertPool()
		if !pool.AppendCertsFromPEM(caCert) {
			return "", fmt.Errorf("parse CA certificate from %s", caPath)
		}

		const name = "aiven-custom-ca"
		if err := mysql.RegisterTLSConfig(name, &tls.Config{
			MinVersion: tls.VersionTLS12,
			RootCAs:    pool,
		}); err != nil {
			return "", fmt.Errorf("register custom tls config: %w", err)
		}
		return name, nil
	default:
		return "", fmt.Errorf("unsupported DB_TLS_MODE %q", mode)
	}
}
