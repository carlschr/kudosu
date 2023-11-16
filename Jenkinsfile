pipeline {
    agent { docker { image 'mcr.microsoft.com/windows-cssc/python3.7.2windows:ltsc2019' } }
    stages {
        stage('build') {
            steps {
                sh 'python --version'
            }
        }
    }
}