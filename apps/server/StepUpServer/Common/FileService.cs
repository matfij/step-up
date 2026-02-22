namespace StepUpServer.Common;

public interface IFileService
{
    Task<string> SaveAsync(string folder, string fileName, Stream content, string contentType);
}

public class FileService : IFileService
{
    public async Task<string> SaveAsync(string folder, string fileName, Stream content, string contentType)
    {
        var path = Path.Combine(Environment.CurrentDirectory, folder);
        Directory.CreateDirectory(path);
        var filePath = Path.Combine(path, fileName);
        await using var fs = File.Create(filePath);
        await content.CopyToAsync(fs);
        return Path.Combine(folder, fileName).ToString();
    }
}
