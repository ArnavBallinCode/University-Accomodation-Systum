package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"uni-accom-api/api"
	"uni-accom-api/config"
	"uni-accom-api/repository"
)

func main() {
	_ = godotenv.Load()
	configureGinMode()

	db, err := config.NewDB()
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}
	defer db.Close()

	studentRepo := repository.NewStudentRepository(db)
	reportRepo := repository.NewReportRepository(db)
	handler := api.NewHandler(studentRepo, reportRepo)

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:    []string{"Origin", "Content-Type", "Accept", "Authorization"},
		MaxAge:          12 * time.Hour,
	}))

	if err := router.SetTrustedProxies(trustedProxiesFromEnv()); err != nil {
		log.Fatalf("configure trusted proxies: %v", err)
	}

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "uni-accom-api",
		})
	})

	handler.RegisterRoutes(router)

	if err := router.Run(serverAddress()); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

func configureGinMode() {
	mode := strings.TrimSpace(os.Getenv("GIN_MODE"))
	if mode == "" {
		mode = gin.DebugMode
	}

	gin.SetMode(mode)
}

func trustedProxiesFromEnv() []string {
	value := strings.TrimSpace(os.Getenv("TRUSTED_PROXIES"))
	if value == "" {
		return []string{"127.0.0.1", "::1"}
	}

	parts := strings.Split(value, ",")
	proxies := make([]string, 0, len(parts))
	for _, part := range parts {
		proxy := strings.TrimSpace(part)
		if proxy != "" {
			proxies = append(proxies, proxy)
		}
	}

	if len(proxies) == 0 {
		return []string{"127.0.0.1", "::1"}
	}

	return proxies
}

func serverAddress() string {
	port := strings.TrimSpace(os.Getenv("PORT"))
	if port == "" {
		port = "8080"
	}

	return ":" + port
}
