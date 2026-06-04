import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { Trash2 } from "lucide-react";
import React, { use, useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAddress() {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });

      setAddress(data.allAddress);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

//   const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    phone: "",
  });

  const handleAddAddress = async () => {
    try {
      const { data } = await axios.post(
        `${server}/api/address/new`,
        {
          address: newAddress.address,
          phone: newAddress.phone,
        },
        {
          headers: {
            token: Cookies.get("token"),
          },
        },
      );

      if (data.message) {
        toast.success(data.message);
        fetchAddress();
        setNewAddress({
          address: "",
          phone: "",
        });
        setModalOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add address. Please try again.",
      );
    }
  };

  const [modalOpen, setModalOpen] = useState(false);


  const deleteHandler = async (id) => {
    try{

        const { data } = await axios.delete(`${server}/api/address/delete/${id}`, {
            headers:{
                token: Cookies.get("token"),
            }
        });

        toast.success(data.message);
        fetchAddress();
    }
    catch(error)
    {
        toast.error(
            error.response?.data?.message ||
              "Failed to delete address. Please try again.",
        );
    }
  }

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-8 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {address && address.length > 0 ? (
              address.map((e) => (
                <div className="p-3 sm:p-4 md:p-5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow" key={e._id}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-sm sm:text-base font-semibold line-clamp-2">
                      {e.address}
                    </h3>
                    <Button variant="destructive" onClick={()=> deleteHandler(e._id)} size="sm" className="flex-shrink-0 dark:bg-red-500 dark:hover:bg-red-600 dark:hover:text-white">
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-white mb-3 line-clamp-1">Phone: {e.phone}</p>
                  <Link to={`/payment/${e._id}`} className="w-full">
                    <Button variant="outline" className="w-full text-xs sm:text-sm py-1 sm:py-2">
                      Use Address
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full py-8 text-gray-500">No Addresses found.</p>
            )}
          </div>
        )}

        <Button
          className="mt-6"
          variant="outline"
          onClick={() => setModalOpen(true)}
        >
          Add New Address
        </Button>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter an address"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
              />

              <Input
                type="number"
                placeholder="Enter phone number"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
            </div>

            <DialogFooter>

           <Button variant="outline" className=" !text-red-600" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>

            <Button variant="outline" className="!text-blue-600" onClick={handleAddAddress}>
              Add Address
            </Button>

          </DialogFooter>
          </DialogContent>
          
        </Dialog>
      </div>
    </>
  );
};

export default Checkout;
