FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S worksphere && adduser -S worksphere -G worksphere
COPY target/*.jar app.jar
RUN chown worksphere:worksphere app.jar
USER worksphere
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
