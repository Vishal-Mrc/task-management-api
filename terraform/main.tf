terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
  }

  required_version = ">= 1.5.0"
}

provider "google" {
  project = "gcptraining2121ttt"
  region  = "us-central1"
}

resource "google_artifact_registry_repository" "task_api_repo" {
  location      = "us-central1"
  repository_id = "task-api-repo"
  description   = "Docker images for task management API"
  format        = "DOCKER"
}

resource "google_firestore_database" "default" {
  name        = "(default)"
  location_id = "us-central1"
  type        = "FIRESTORE_NATIVE"
}

resource "google_service_account" "task_api_runtime" {
  account_id   = "task-api-runtime"
  display_name = "Task Management API Runtime"
}

resource "google_project_iam_member" "task_api_firestore" {
  project = "gcptraining2121ttt"
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.task_api_runtime.email}"
}

resource "google_cloud_run_v2_service" "task_api" {
  name     = "task-management-api"
  location = "us-central1"

  template {
    containers {
      image = "us-central1-docker.pkg.dev/gcptraining2121ttt/task-api-repo/task-management-api:v1"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }

        cpu_idle          = true
        startup_cpu_boost = true
      }
    }

    service_account = google_service_account.task_api_runtime.email
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version
    ]
  }
}