namespace AzureFunctionV2Book.Function
{
    using System.Net.Http;
    using System.Threading.Tasks;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Azure.WebJobs.Host;
    using Microsoft.Extensions.Logging;

    public static class OrchestrationClient_Start
    {
        [FunctionName("OrchestrationClient_Start")]
        public static async Task<HttpResponseMessage> HttpStart(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")]HttpRequestMessage req,
            [OrchestrationClient]DurableOrchestrationClient starter,
            ILogger log)
        {
            string instanceId = await starter.StartNewAsync("Orchestrator_City", null);
            log.LogInformation($"Running orchestration with ID = '{instanceId}'.");
            return starter.CreateCheckStatusResponse(req, instanceId);
        }
    }
}