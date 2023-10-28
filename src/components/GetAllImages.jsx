import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

const GetAllImages = () => {
  const [images, setImages] = useState([]);

  // Function to fetch images from Firestore
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
  }, []); // Fetch images when the component mounts

  // Function to delete an image by its ID
  const deleteImage = async (id) => {
    try {
      const imageRef = doc(db, 'images', id);
      await deleteDoc(imageRef);
      // Refresh the images list after deletion
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Function to handle edit functionality (you can implement your edit logic here)
  const handleEdit = (id) => {
    // Implement your edit logic here
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-[50px] text-center mt-10">
        My Images
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="border border-gray-200 flex flex-col gap-4 object-contain w-[200px] h-[280px] rounded p-4 relative"
          >
            <img
              src={image.imageUrl}
              alt={`Image ${image.id}`}
              className="w-full h-[200px]"
            />
            <div className="flex justify-between ">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllImages;
