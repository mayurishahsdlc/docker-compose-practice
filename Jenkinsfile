pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Check') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Container Status') {
            steps {
                sh 'docker compose ps'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for backend to become healthy..."

                    for i in {1..12}; do
                        if curl -f http://127.0.0.1:4000/health; then
                            echo "Backend is healthy!"
                            exit 0
                        fi

                        echo "Backend not ready yet. Waiting 5 seconds..."
                        sleep 5
                    done

                    echo "Backend health check failed."
                    docker compose ps
                    docker compose logs --tail=100 backend
                    exit 1
                '''
            }
        }
    }
}
