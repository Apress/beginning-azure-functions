namespace AzureFunctionV2Book.Function
{
    using Microsoft.Azure.WebJobs;
    using Microsoft.Extensions.Logging;

    public static class City_Travel
    {
        [FunctionName("City_Travel")]
        public static string Run([ActivityTrigger] string cityName, ILogger log)
        {
            log.LogInformation($"I am travelling to {cityName}.");
            return $"I am travelling to {cityName}!";
        }
    }
}