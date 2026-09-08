pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

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

        stage('Remove Old Staging Containers') {
            steps {
                sh '''
                    docker rm -f docker-practice-staging-backend 2>/dev/null || true
                    docker rm -f docker-practice-staging-frontend 2>/dev/null || true
                    docker rm -f docker-practice-staging-mongo 2>/dev/null || true
                '''
            }
        }

        stage('Deploy Staging') {
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
                    echo "Waiting for staging backend..."

                    for i in $(seq 1 12)
                    do
                        if curl -f http://127.0.0.1:4001/health
                        then
                            echo "STAGING BACKEND HEALTHY"
                            exit 0
                        fi

                        echo "Waiting 5 seconds..."
                        sleep 5
                    done

                    echo "STAGING HEALTH CHECK FAILED"

                    docker compose ps
                    docker compose logs --tail=100 backend

                    exit 1
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose ps || true'
        }

        success {
            echo 'STAGING DEPLOYMENT SUCCESSFUL'
        }

        failure {
            echo 'STAGING DEPLOYMENT FAILED'
        }
    }
}
