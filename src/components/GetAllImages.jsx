import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../Firebase/Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loader from './Loader';

const GetAllImages = () => {
  const [images, setImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      const imageCollectionRef = collection(db, 'images');
      const imageSnapshot = await getDocs(imageCollectionRef);
      const imageList = [];
      imageSnapshot.forEach((doc) => {
        imageList.push({ id: doc.id, ...doc.data() });
      });
      setImages(imageList);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const deleteImage = async (id) => {
    try {
      const imageRef = doc(db, 'images', id);
      await deleteDoc(imageRef);
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleEdit = (id) => {
    setEditingImage(id);
  };

  const handleUpdate = async (id) => {
    if (newImage) {
      try {
        setLoading(true);
        // Upload the new image to Firebase Storage
        const storageRef = ref(storage, `images/${newImage.name}`);
        await uploadBytes(storageRef, newImage);
        const downloadUrl = await getDownloadURL(storageRef);

        // Update the image URL in Firestore
        const imageRef = doc(db, 'images', id);
        await updateDoc(imageRef, { imageUrl: downloadUrl });

        setEditingImage(null);
        setNewImage(null);
        fetchImages();
        setLoading(false);
        console.log('Image updated successfully');
      } catch (error) {
        setLoading(false);
        console.error('Error updating image:', error);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-[50px] text-center mt-10">
        My Images
      </h1>
      {images.length === 0 ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 px-4  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border border-gray-200 flex flex-col gap-4 object-contain w-[200px] h-[280px] rounded p-4 relative"
            >
              {editingImage === image.id ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {newImage ? (
                    loading ? (
                      <Loader />
                    ) : (
                      <button
                        onClick={() => handleUpdate(image.id)}
                        className="bg-green-500 w-[70px] text-white px-2 py-1 rounded-md"
                      >
                        Update
                      </button>
                    )
                  ) : null}
                </>
              ) : (
                <>
                  <img
                    src={image.imageUrl}
                    alt={`Image ${image.id}`}
                    className="w-full h-[200px]"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEdit(image.id)}
                      className="bg-blue-500 w-[70px] text-white px-2 py-1 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="bg-red-500 w-[70px] text-white px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllImages;
