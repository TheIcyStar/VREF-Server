# Reference used: https://codefresh.io/docs/docs/example-catalog/ci-examples/gradle/
# Build with gradle
FROM gradle:8.11.1 AS build

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon


# Copy over the jar and deploy
FROM amazoncorretto:21-alpine
EXPOSE 8080
RUN mkdir /app

COPY --from=build /home/gradle/src/build/libs/*.jar /app/

CMD ["java", "-jar", "/app/vref-server-0.0.1-SNAPSHOT.jar"]
