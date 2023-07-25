import React, { useState } from 'react';
import { storage } from '../firebase';

export const handleChange = (e, setImageState) => {
  if (e.target.files[0]) {
    setImageState(e.target.files[0]);
  }
};

export const handleUpload = (image, setImage) => {
  if (image) {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setImage(url);
          });
      }
    );
  }
};

export default function ImageUpload({ setImage }) {
  const [image, setImageState] = useState(null);

  const handleChangeWrapper = (e) => handleChange(e, setImageState);
  const handleUploadWrapper = () => handleUpload(image, setImage);

  return (
    <div>
      <br />
      <input type="file" onChange={(e) => handleChangeWrapper(e)} />
      <button onClick={handleUploadWrapper}>Upload</button>
    </div>
  );
};
