namespace AzureFunctionV2Book.Function
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Azure.WebJobs;

    public static class Orchestrator_City
    {
        [FunctionName("Orchestrator_City")]
        public static async Task<List<string>> Run(
            [OrchestrationTrigger] DurableOrchestrationContext context)
        {
            var outputs = new List<string>();

            outputs.Add(await context.CallActivityAsync<string>("City_Travel", "Hyderabad"));
            outputs.Add(await context.CallActivityAsync<string>("City_Travel", "New York"));
            outputs.Add(await context.CallActivityAsync<string>("City_Travel", "Delhi"));

            // returns 
            // "I am travelling to Hyderabad" 
            // "I am travelling to New York"
            // "I am travelling to Delhi"

            return outputs;
        }

    }
}