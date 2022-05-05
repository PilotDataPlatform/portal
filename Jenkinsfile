pipeline {
    agent { label 'master' }
    environment {
      imagename = "ghcr.io/pilotdataplatform/portal"
      commit = sh(returnStdout: true, script: 'git describe --always').trim()
      registryCredential = 'pilot-ghcr'
      dockerImage = ''
    }
    stages {
      stage('Git clone for dev') {
          when {branch "develop"}
          steps{
            script {
            git branch: "develop",
                url: 'https://github.com/PilotDataPlatform/portal.git',
                credentialsId: 'lzhao'
              }
          }
      }
      stage('DEV unit test') {
        when {branch "develop"}
        steps{
         withCredentials([
              usernamePassword(credentialsId:'readonly', usernameVariable: 'PIP_USERNAME', passwordVariable: 'PIP_PASSWORD'),
              string(credentialsId:'VAULT_TOKEN', variable: 'VAULT_TOKEN'),
              string(credentialsId:'VAULT_URL', variable: 'VAULT_URL'),
              file(credentialsId:'VAULT_CRT', variable: 'VAULT_CRT'),
              usernamePassword(credentialsId:'collabTestPass', usernameVariable: 'COLLAB_TEST_PASS_USERNAME', passwordVariable: 'COLLAB_TEST_PASS_PASSWORD')
            ]) {
              sh """
              export VAULT_TOKEN=${VAULT_TOKEN}
              export VAULT_URL=${VAULT_URL}
              export VAULT_CRT=${VAULT_CRT}
              export PROJECT_NAME="VRE"
              export CORE_ZONE_LABEL="VRECore"
              export GREENROOM_ZONE_LABEL="Greenroom"
              export AD_USER_GROUP="vre-users"
              export AD_PROJECT_GROUP_PREFIX="vre-"
              export KONG_PATH="/vre/"
              export EMAIL_SUPPORT="jzhang@indocresearch.org"
              export EMAIL_ADMIN="cchen@indocresearch.org"
              export EMAIL_HELPDESK="helpdesk@vre"
              export COLLAB_TEST_PASS=${COLLAB_TEST_PASS_PASSWORD}
              cd backend
              pip install --user poetry==1.1.12
              ${HOME}/.local/bin/poetry config virtualenvs.in-project true
              ${HOME}/.local/bin/poetry config http-basic.pilot ${PIP_USERNAME} ${PIP_PASSWORD}
              ${HOME}/.local/bin/poetry install --no-root --no-interaction
              ${HOME}/.local/bin/poetry run pytest --verbose -c tests/pytest.ini
              """
          }
        }
      }
  
      stage('DEV Build and push portal-dev image') {
        steps{
          script {
              docker.withRegistry('https://ghcr.io', registryCredential) {
                  customImage = docker.build("$imagename:$commit")
                  customImage.push()
              }
          }
        }
      }
  
      stage('DEV Remove portal-dev image') {
        steps{
          sh "docker rmi $imagename:$commit"
        }
      }
  
      stage('DEV Build and push portal image') {
        steps{
          script {
              docker.withRegistry('https://ghcr.io', registryCredential) {
                  customImage = docker.build("$imagename:$commit")
                  customImage.push()
              }
          }
        }
      }
  
      stage('DEV Remove portal image') {
        steps{
          sh "docker rmi $imagename:$commit"
        }
      }
  
      stage('DEV Deploy portal') {
        steps{
          build(job: "/VRE-IaC/UpdateAppVersion", parameters: [
            [$class: 'StringParameterValue', name: 'TF_TARGET_ENV', value: 'dev' ],
            [$class: 'StringParameterValue', name: 'TARGET_RELEASE', value: 'portal' ],
            [$class: 'StringParameterValue', name: 'NEW_APP_VERSION', value: "$commit" ]
          ])
        }
      }
  
      stage('Git clone staging') {
          when {branch "main"}
          steps{
            script {
            git branch: "main",
                url: 'https://github.com/PilotDataPlatform/portal.git',
                credentialsId: 'lzhao'
              }
          }
      }
  
      stage('STAGING Building and push portal image') {
        when {
            allOf {
                changeset "portal/**"
                branch "k8s-staging"
              }
        }
        steps{
          script {
              docker.withRegistry('https://ghcr.io', registryCredential) {
                  customImage = docker.build("$imagename:$commit")
                  customImage.push()
              }
          }
        }
      }
  
      stage('STAGING Remove portal image') {
        steps{
          sh "docker rmi $imagename:$commit"
        }
      }
  
      stage('STAGING Deploy portal') {
        steps{
        build(job: "/VRE-IaC/Staging-UpdateAppVersion", parameters: [
          [$class: 'StringParameterValue', name: 'TF_TARGET_ENV', value: 'staging' ],
          [$class: 'StringParameterValue', name: 'TARGET_RELEASE', value: 'portal' ],
          [$class: 'StringParameterValue', name: 'NEW_APP_VERSION', value: "$commit" ]
        ])
        }
      }
    }
    post {
      failure {
          slackSend color: '#FF0000', message: "Build Failed! - ${env.JOB_NAME} commit_hash:$commit  (<${env.BUILD_URL}|Open>)", channel: 'jenkins-dev-staging-monitor'     
    }
  }
}
