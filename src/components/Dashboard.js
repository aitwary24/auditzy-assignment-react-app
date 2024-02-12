import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { auth, updateProductInFirebase, deleteProductFromFirebase, getProductsFromFirebase, db } from '../firebase';

import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,query,where,orderBy,
  getDocs,
} from 'firebase/firestore';

const Dashboard = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Products');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // New state
  const navigate = useNavigate();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const productDetailsStyle = {
    paddingTop: '80px',
    display: 'flex',
    marginLeft: isDrawerOpen ? '240px' : '0', // Adjust the value based on your drawer width
    transition: 'margin-left 0.3s ease', // Add a smooth transition for better user experience
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const response = await axios.get('https://fakestoreapi.com/products');

        const apiProducts = response.data;
   // Save data to Firebase
   await saveProductsInFirebase(apiProducts);

   // Fetch data from Firebase
   const firebaseProducts = await getProductsFromFirebase();
   console.log('Firebase Products:', firebaseProducts);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const saveProductsInFirebase = async (products) => {
    try {
      const productRef = collection(db, 'products');
      // Fetch existing products from Firestore
      const existingProductsSnapshot = await getDocs(query(collection(db, 'products'), orderBy('id')));
      const existingProducts = existingProductsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      // Identify products that are not already in Firestore
      const newProducts = products.filter((apiProduct) => {
        return !existingProducts.some(
          (existingProduct) => existingProduct.id === apiProduct.id
        );
      });
  
      // Check if there are new products to add
      if (newProducts.length > 0) {
        // Add only the new products to Firestore
        for (const product of newProducts) {
          await addDoc(productRef, product);
        }
  
        // Fetch and update the product list after adding new products
        const updatedProductsSnapshot = await getDocs(query(collection(db, 'products'), orderBy('id')));
        const updatedProducts = updatedProductsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserData(updatedProducts);
      } else {
        // If no new products, just set the existing products
        setUserData(existingProducts);
      }
    } catch (error) {
      console.error('Error saving products in Firestore:', error);
      throw error;
    }
  };

  
  
  const addProductToFirebase = async (productData) => {
    try {
      const productRef = collection(db, 'products');
      await addDoc(productRef, productData);
    } catch (error) {
      console.error('Error adding product to Firestore:', error);
      throw error;
    }
  };
  const handleDeleteProduct = async (productId) => {
    try {
      setLoadingDelete(true);
      
      console.log('Deleting product with ID:', productId);
  
      // Delete the product from Firestore
      await deleteProductFromFirebase(productId);
  
      // Update the state to remove the deleted product
      setUserData((prevUserData) => prevUserData.filter((product) => product.id !== productId));
  
      console.log('Product deleted successfully.');
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoadingDelete(false);
    }
  };
  
  
  
  
  
  
  const handleUpdateProduct = async () => {
    try {
      setLoadingUpdate(true);
  
      if (!selectedProduct || !selectedProduct.id) {
        console.error('Invalid selected product for update.');
        return;
      }
  
      // Extract only the properties you want to update
      const { title, description, price } = selectedProduct;
  
      // Create an object with only the defined properties
      const updatedProductData = {
        title,
        description,
        price,
        // Add other properties as needed
      };
  
      // Update the product in Firebase
      await updateProductInFirebase(selectedProduct.id, updatedProductData);
  
      // Fetch the updated product list after the update
      const updatedProducts = await getProductsFromFirebase();
  
      // Update the state with the fetched data
      setUserData(updatedProducts);
  
      // Close the update dialog
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoadingUpdate(false);
    }
  };
  
  
  
  
  const handleToggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setOpenDialog(false);
  };

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setIsProfileModalOpen(false); // Close the profile modal when the drawer is toggled
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDrawerOpen(false); // Close the drawer when an option is selected
  };

  //const navigate = useNavigate(); // Use the useNavigate hook instead of useHistory

  const handleLogout = () => {
    auth.signOut();
    setIsProfileModalOpen(false);
    navigate('/',{ replace: true });; // Redirect to the Login page
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleToggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
  {(() => {
    switch (selectedOption) {
      case 'Products':
        return 'Products';
      case 'About Us':
        return 'About Us';
      case 'Settings':
        return 'Settings';
      case 'Users':
        return 'Users';
      default:
        return 'Your Dashboard';
    }
  })()}
</Typography>

          <Avatar
            alt={auth.currentUser ? auth.currentUser.displayName : ''}
            src={auth.currentUser ? auth.currentUser.photoURL : ''}
            onClick={handleToggleProfileModal}
          />
        </Toolbar>
      </AppBar>
  {/* Show loading spinner if data is being fetched */}
  {loadingData ? (
  <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    <CircularProgress />
  </div>
) : (
  userData.length === 0 && (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="subtitle1">No data available.</Typography>
    </div>
  )
)}
      <Drawer anchor="left" open={isDrawerOpen} variant="temporary" onClose={handleToggleDrawer}>
        <List>
          {['Products', 'About Us', 'Settings', 'Users'].map((option) => (
            <ListItem
              button
              key={option}
              selected={selectedOption === option}
              onClick={() => handleOptionClick(option)}
            >
              <ListItemText primary={option} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <div style={{ paddingTop: '80px', display: 'flex', ...productDetailsStyle }}>
        <div style={{ padding: '20px' }}>
          
          {selectedOption === 'Products' && (
            <div>
              <h2>Total Products: {userData.length}</h2>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userData.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>
                          <Button variant="outlined" onClick={() => handleOpenDialog(product)}>
                            Update
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={loadingDelete}
                          >
                            {loadingDelete ? <CircularProgress size={20} /> : 'Delete'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
         

          {selectedOption === 'About Us' && (
            <div>
              <h2>About Us</h2>
              {/* Display About Us Content */}
            </div>
          )}

          {selectedOption === 'Settings' && (
            <div>
              <h2>Settings</h2>
              {/* Display Settings Content */}
            </div>
          )}

          {selectedOption === 'Users' && (
            <div>
              <h2>Users</h2>
              {/* Display Users Content */}
            </div>
          )}

          {/* Update Product Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Update Product</DialogTitle>
            <DialogContent>
              <TextField
                label="Product Title"
                value={selectedProduct ? selectedProduct.title : ''}
                onChange={(e) =>
                  setSelectedProduct((prevProduct) => ({ ...prevProduct, title: e.target.value }))
                }
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Product Description"
                value={selectedProduct ? selectedProduct.description : ''}
                onChange={(e) =>
                  setSelectedProduct((prevProduct) => ({
                    ...prevProduct,
                    description: e.target.value,
                  }))
                }
              />
              <TextField
                label="Product Price"
                type="number"
                value={selectedProduct ? selectedProduct.price : 0}
                onChange={(e) =>
                  setSelectedProduct((prevProduct) => ({
                    ...prevProduct,
                    price: parseFloat(e.target.value),
                  }))
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleUpdateProduct} disabled={loadingUpdate}>
                {loadingUpdate ? <CircularProgress size={20} /> : 'Update'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Profile Modal */}
          <Dialog open={isProfileModalOpen} onClose={handleToggleProfileModal}>
        <DialogTitle>
          User Profile
          <IconButton edge="end" color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Avatar
            alt={auth.currentUser ? auth.currentUser.displayName : ''}
            src={auth.currentUser ? auth.currentUser.photoURL : ''}
          />
          <Typography variant="h6">
            Email: {auth.currentUser ? auth.currentUser.email : ''}
          </Typography>
          {/* Add more user details as needed */}
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
