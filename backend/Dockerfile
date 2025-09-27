FROM mcr.microsoft.com/dotnet/sdk:9.0
WORKDIR /app
COPY . ./
RUN dotnet restore
EXPOSE 8080
CMD ["dotnet", "watch", "run","--project","Linquiztic", "--urls", "http://0.0.0.0:8080"]