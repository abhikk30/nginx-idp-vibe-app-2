// CI for nginx-idp-vibe-app-2: kaniko build -> in-cluster registry -> bump chart image.tag.
// Mirrors the idp-sample-nginx pattern; reuses the `github-pat` Jenkins credential.
pipeline {
  agent { kubernetes { yamlFile 'jenkins-pod.yaml' } }
  stages {
    stage('build & push') {
      steps {
        container('kaniko') {
          sh '/kaniko/executor --context=`pwd` --dockerfile=Dockerfile ' +
             "--destination=kind-registry:5000/lw-idp/nginx-idp-vibe-app-2:${env.GIT_COMMIT}"
        }
      }
    }
    stage('bump tag') {
      steps {
        // GITHUB_ORG must be provided as a Jenkins global env var (the org that owns this repo).
        withCredentials([string(credentialsId: 'github-pat', variable: 'GITHUB_PAT')]) {
          sh '''
            sed -i "s|tag: .*|tag: \\"${GIT_COMMIT}\\"|" chart/values.yaml
            git config user.email "jenkins@lw-idp.local"
            git config user.name "jenkins"
            git commit -am "ci: bump nginx-idp-vibe-app-2 image tag to ${GIT_COMMIT}"
            git push https://${GITHUB_PAT}@github.com/${GITHUB_ORG}/nginx-idp-vibe-app-2.git HEAD:main
          '''
        }
      }
    }
  }
}
