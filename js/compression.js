document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.querySelector('.preview-container');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const fileFormat = document.getElementById('fileFormat');
    const compressionRatio = document.getElementById('compressionRatio');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadButton = document.getElementById('downloadButton');

    let originalFile = null;

    // 连接上传按钮和文件输入框
    const uploadButton = document.querySelector('.upload-button');
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    // 拖放处理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    });

    // 文件选择处理
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // 质量滑块处理
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalFile) {
            compressImage(originalFile, e.target.value / 100);
        }
    });

    // 文件处理函数
    function handleFile(file) {
        originalFile = file;
        previewContainer.hidden = false;

        // 显示原始文件信息
        originalSize.textContent = formatFileSize(file.size);
        fileFormat.textContent = file.type.split('/')[1].toUpperCase();

        // 预览原始图片
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            compressImage(file, qualitySlider.value / 100);
        };
        reader.readAsDataURL(file);
    }

    // 图片压缩函数
    function compressImage(file, quality) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    const compressedUrl = URL.createObjectURL(blob);
                    compressedPreview.src = compressedUrl;
                    compressedSize.textContent = formatFileSize(blob.size);
                    
                    const ratio = ((1 - blob.size / file.size) * 100).toFixed(1);
                    compressionRatio.textContent = `${ratio}% smaller`;

                    // 更新下载按钮
                    downloadButton.onclick = () => {
                        const link = document.createElement('a');
                        link.href = compressedUrl;
                        link.download = `compressed_${file.name}`;
                        link.click();
                    };
                }, file.type, quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 文件大小格式化
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 