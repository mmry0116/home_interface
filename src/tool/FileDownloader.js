class FileDownloader {
  constructor({ url, fileName, chunkSize = 2 * 1024 * 1024, cb }) {
    this.url = url;
    this.fileName = fileName;
    this.chunkSize = chunkSize;
    this.fileSize = 0;
    this.totalChunks = 0;
    this.currentChunk = 0;
    this.downloadedSize = 0;
    this.chunks = [];
    this.abortController = new AbortController();
    this.paused = false;
    this.cb = cb
  }

  async getFileSize() {
    const response = await fetch(this.url, { signal: this.abortController.signal });
    const contentLength = response.headers.get("content-length");
    this.fileSize = parseInt(contentLength);
    this.totalChunks = Math.ceil(this.fileSize / this.chunkSize);
  }

  async downloadChunk(chunkIndex) {
    try {
      const start = chunkIndex * this.chunkSize;
      const end = Math.min(this.fileSize, (chunkIndex + 1) * this.chunkSize - 1);

      const response = await fetch(this.url, {
        headers: { Range: `bytes=${start}-${end}` },
        signal: this.abortController.signal
      });

      if (!response.ok) { throw new Error('Network response was not ok'); }

      const blob = await response.blob();
      this.chunks[chunkIndex] = blob;
      this.downloadedSize += blob.size;

      if (!this.paused && this.currentChunk < this.totalChunks - 1) {
        this.currentChunk++;
        this.downloadChunk(this.currentChunk);
      } else if (this.currentChunk === this.totalChunks - 1) {
        this.mergeChunks();
      }
    } catch (err) {
      console.log('err', err)
    }
  }

  async startDownload() {
    if (this.chunks.length === 0) {
      await this.getFileSize();
    }
    this.downloadChunk(this.currentChunk);
  }

  pauseDownload() {
    this.paused = true;
  }

  resumeDownload() {
    this.paused = false;
    this.downloadChunk(this.currentChunk);
  }

  cancelDownload() {
    this.abortController.abort();
    this.reset();
  }

  async mergeChunks() {
    const blob = new Blob(this.chunks, { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = this.fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      this.cb && this.cb({
        downState: 1
      })
      this.reset();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  reset() {
    this.chunks = [];
    this.fileName = '';
    this.fileSize = 0;
    this.totalChunks = 0;
    this.currentChunk = 0;
    this.downloadedSize = 0;
  }
}


// 使用示例
const url = "https://example.com/largefile.zip";
const fileName = "largefile.zip";

const downloader = new FileDownloader({ url, fileName, cb: this.updateData });

// 更新状态
function updateData(res) {
  const { downState } = res
  this.downState = downState
}

// 开始下载
downloader.startDownload();

// 暂停下载
// downloader.pauseDownload();

// 继续下载
// downloader.resumeDownload();

// 取消下载
// downloader.cancelDownload();

