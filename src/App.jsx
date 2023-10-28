import AddImage from './components/AddImage';
import GetAllImages from './components/GetAllImages';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/">
          <Route index element={<AddImage />} />
          <Route path="getAllImages" element={<GetAllImages />} />
        </Route>
      </>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
