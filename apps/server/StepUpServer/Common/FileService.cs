namespace StepUpServer.Common;

public interface IFileService
{
    Task<string> SaveAsync(string folder, string fileName, Stream content);
}

public class FileService : IFileService
{
    private const string _baseFolder = "uploads";

    public async Task<string> SaveAsync(string folder, string fileName, Stream content)
    {
        var path = Path.Combine(_baseFolder, folder);
        Directory.CreateDirectory(path);
        var filePath = Path.Combine(path, fileName);
        await using var fs = File.Create(filePath);
        await content.CopyToAsync(fs);
        return $"/uploads/{folder}/{fileName}";
    }
}
