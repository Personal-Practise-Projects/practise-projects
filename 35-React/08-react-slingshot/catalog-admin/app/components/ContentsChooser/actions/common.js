import { CancelToken } from 'axios'

export function getFileOptions(file, progressListener) {
  return {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    onUploadProgress: progressEvent => {
      const loadProgress = Math.min(
        99,
        Math.round((progressEvent.loaded / progressEvent.total) * 100),
      );
      progressListener && progressListener(loadProgress);
    },
    cancelToken: new CancelToken(cancel =>
      Object.assign(file, { cancelToken: cancel }),
    ),
  };
}
