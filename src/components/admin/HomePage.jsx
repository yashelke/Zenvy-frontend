import { ProductData } from '@/context/ProductContext'
import React from 'react'
import {useState} from 'react'
import { Button } from '../ui/button'
import Loading from '../Loading';
import ProductCard from '../ProductCard';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { categories } from "@/main.jsx";
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '@/main.jsx';
import Cookies from 'js-cookie';

const HomePage = () => {

    const { products, page, setPage, fetchProducts, loading, totalPages} = ProductData();


     const nextPage = () =>
    {
      setPage(page + 1);
    }

      const prevPage = () =>
    {
      setPage(page - 1);
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if(!formData.images || formData.images.length === 0){
            toast.error("Please select images for the product.");
            return;
        }

        const form = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if(key === "images"){
                for(let i=0; i<value.length; i++){
                    form.append("files", value[i]);
                }
            }
            else{
                form.append(key, value);
            }

        });

        try{

            const { data } = await axios.post(`${server}/api/product/new`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    token:Cookies.get("token"),
                },
            });

            toast.success(data.message);
            setOpen(false);
            setFormData({
                title:"",
                about:"",
                price:"",
                category:"",
                stock:"",
                images: null,
            });

            fetchProducts();

        }
        catch(error){
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to add product. Please try again.");
        }
    }
    // dialog box for adding a produxt by the admin
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        title:"",
        about:"",
        price:"",
        category:"",
        stock:"",
        images: null,
       
    });

    const handleChange = (e) => {

        const { name, value} = e.target;

        setFormData((prev) => ({...prev, [name]: value}));

    }


    const handleFileChange = (e) => {
        setFormData((prev) => ({...prev, images: e.target.files }));
    }

  return (
  <>

  <div>

    <div className="flex justify-between">
        <h2 className="text-2xl font-bold">All Products</h2>

{/* dialog box for adding a product by the admin */}

        <Button onClick={() => setOpen(true)} className="mb-4">
            Add Product
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
           
           <DialogTrigger />

           <DialogContent>
            <DialogHeader>
                <DialogTitle>Add a new Product</DialogTitle>
            </DialogHeader>

            <form onSubmit={submitHandler} className="space-y-4">
                <Input name="title" placeholder="Product Title" value={formData.title} onChange={handleChange} required></Input>
                <Input name="about" placeholder="Product Description" value={formData.about} onChange={handleChange} required></Input>
                <Input name="price" placeholder="Product Price" value={formData.price} onChange={handleChange} required></Input>
                <select className="dark:bg-black dark:text-white" name="category" placeholder="Product Category" value={formData.category} onChange={handleChange} required>
                    <option value={""}>Select Category</option>
                    {categories.map((cat) => (
                        <option value={cat} key={cat}>{cat}</option>
                    ))}
                </select>
                <Input name="stock" placeholder="Product Stock" value={formData.stock} onChange={handleChange} required></Input>
                <Input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} required></Input>

                <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
                    Add Product
                </Button>
            </form>
           </DialogContent>
            
        </Dialog>




    </div>


    {
        loading ? <Loading /> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
                products && products.length > 0 ? products.map((e) => {
                    return <ProductCard product={e} key={e._id} latest={"no"} />
                }):
                <p>No Products yet.</p>
            }
        </div>
    }

    <div className="mt-2 mb-3">
            <Pagination>
              <PaginationContent>
                { page!==1 && (
                  <PaginationItem className="cursor-pointer" onClick={prevPage}>
                    <PaginationPrevious />
                  </PaginationItem>
                )}

                {
                  page !== totalPages && (

                    <PaginationItem className="cursor-pointer" onClick={nextPage}>
                    <PaginationNext />
                  </PaginationItem>


                  )
                }
              </PaginationContent>
            </Pagination>

          </div>


  </div>
  
  
  </>
  )
}

export default HomePage