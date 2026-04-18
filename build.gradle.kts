plugins {
    java
    application
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(24)
    }
}

application {
    mainClass = "Main"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.apache.logging.log4j:log4j-api:2.24.3")
    implementation("org.apache.logging.log4j:log4j-core:2.24.3")
    implementation("com.google.code.gson:gson:2.12.1")
    implementation("org.springframework.security:spring-security-crypto:6.3.4")
    runtimeOnly("commons-logging:commons-logging:1.3.4")
    implementation("com.auth0:java-jwt:4.4.0")
}

sourceSets {
    main {
        java.srcDirs("src")
        resources.srcDirs("src/resources")
    }
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

tasks.withType<JavaExec> {
    jvmArgs("-Dstdout.encoding=UTF-8", "-Dstderr.encoding=UTF-8")
}
