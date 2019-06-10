using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Blob;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace AzureFunctionv2Book.Function
{
    public static class BlobTriggerCSharp
    {
        [FunctionName("BlobTriggerCSharp")]
        public static async Task Run([BlobTrigger("image-blob/{name}", Connection = "AzureWebJobsStorage")]Stream myBlob, string name, [Blob("output-blob/{name}", FileAccess.ReadWrite, Connection = "AzureWebJobsStorage")]CloudBlockBlob outputBlob, ILogger log)
        {
            log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");

            var width = 100;
            var height = 200;
            var encoder = new PngEncoder();
            using (var output = new MemoryStream())
            using (Image<Rgba32> image = Image.Load(myBlob))
            {
                image.Mutate(x => x.Resize(width, height));
                image.Save(output, encoder);
                output.Position = 0;
                await outputBlob.UploadFromStreamAsync(output);
            }
        }
    }
}
