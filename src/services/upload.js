/**
 * Service to handle file uploads to Cloudflare R2
 * using a secure Presigned URL from a Cloudflare Worker.
 */

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export const uploadToR2 = async (file, onProgress) => {
    try {
        // 1. Get presigned URL from Cloudflare Worker
        const response = await fetch(`${WORKER_URL}/generate-upload-url?file=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`);

        if (!response.ok) {
            throw new Error("Failed to generate upload URL");
        }

        const { uploadUrl, publicUrl } = await response.json();

        // 2. Upload file directly to R2 using XHR for progress tracking
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadUrl);
            xhr.setRequestHeader("Content-Type", file.type);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable && onProgress) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    onProgress(Math.round(percentComplete));
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(publicUrl);
                } else {
                    reject(new Error("Failed to upload file to R2"));
                }
            };

            xhr.onerror = () => {
                reject(new Error("Network error during upload"));
            };

            xhr.send(file);
        });
    } catch (error) {
        console.error("R2 Upload Error:", error.message);
        throw error;
    }
};
