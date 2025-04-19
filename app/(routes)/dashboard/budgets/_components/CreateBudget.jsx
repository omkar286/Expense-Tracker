"use client"
import React, { useState } from 'react';
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from 'components/components/ui/dialog';
import EmojiPicker from 'emoji-picker-react';
import { Button } from 'components/components/ui/button';
import { Input } from '@components/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

function CreateBudget({ refreshData }) {
    const [emojiIcon, setEmojiIcon] = useState('😊');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const { user } = useUser();

    const onCreateBudget = async () => {
        const res = await fetch('/api/budget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            amount,
            icon: emojiIcon,
            createdBy: user?.primaryEmailAddress?.emailAddress, // ✅ Send email from client
          }),
        });
      
        const result = await res.json();
      
        if (res.ok) {
          toast('✅ Budget created!');
          refreshData();
        } else {
          toast(`❌ Error: ${result.error}`);
        }
      };
      

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='bg-gray-100 p-10 rounded-md items-center flex flex-col 
                    border-2 border-dashed cursor-pointer hover:shadow-md'>
                    <h2 className='text-3xl'>+</h2>
                    <h2>Create New Budget</h2>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>
                        <div className='mt-5'>
                            <Button variant='outline' className='text-lg' onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                {emojiIcon}
                            </Button>
                            {openEmojiPicker && (
                                <EmojiPicker
                                    onEmojiClick={(e) => {
                                        setEmojiIcon(e.emoji);
                                        setOpenEmojiPicker(false);
                                    }}
                                />
                            )}
                            <div className='mt-2'>
                                <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                <Input placeholder='ex. Home Decor' onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mt-2'>
                                <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                <Input type='number' placeholder='ex. ₹5000' onChange={(e) => setAmount(e.target.value)} />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button
                            disabled={!(name && amount)}
                            onClick={onCreateBudget}
                            className='mt-5 w-full'>
                            Create Budget
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateBudget;
