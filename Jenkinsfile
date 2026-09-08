pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
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
                echo 'Building Docker images...'
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting Docker containers...'
                sh 'docker compose up -d'
            }
        }

        stage('Container Status') {
            steps {
                echo 'Checking container status...'
                sh 'docker compose ps'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for backend health check..."

                    for i in $(seq 1 12)
                    do
                        if curl -f http://127.0.0.1:4000/health
                        then
                            echo "Backend is healthy!"
                            exit 0
                        fi

                        echo "Backend not ready. Waiting 5 seconds..."
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

    post {
        always {
            echo 'Pipeline finished.'
            sh 'docker compose ps || true'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }

        success {
            echo 'Deployment completed successfully!'
        }
    }
}
