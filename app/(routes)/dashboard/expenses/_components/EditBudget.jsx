"use client"
import { Button } from '@components/components/ui/button';
import { PenBox } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'components/components/ui/dialog';
import EmojiPicker from 'emoji-picker-react';
import { Input } from '@components/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { db } from '@utils/index';
import { Budgets } from '@utils/schema';
import { toast } from 'sonner';
import { eq } from 'drizzle-orm';



function EditBudget({budgetInfo,refreshData}) {
    const [emojiIcon, setEmojiIcon] = useState();
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const {user} = useUser();

    useEffect(()=>{
        setEmojiIcon(budgetInfo?.icon)
        setName(budgetInfo?.name)
        setAmount(budgetInfo?.amount)
    },[budgetInfo])

    const onUpdateBudget=async()=>{

        const result=await db.update(Budgets).set({
            name:name,
            amount:amount,
            icon: emojiIcon
        }).where(eq(Budgets.id,budgetInfo.id))
        .returning();

        if(result){
            refreshData()
            toast('Budget Updated!')
        }
    }
    return (
        <div>
            <div>
                
                <Dialog>
                    <DialogTrigger asChild>
                    <Button className="flex gap-2"> <PenBox /> Edit</Button>


                        </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Budget</DialogTitle>
                            <DialogDescription>
                                <div className='mt-5'>
                                    <Button variant='outline'
                                        className='text-lg'

                                        onClick={() => setOpenEmojiPicker(!openEmojiPicker)}> {emojiIcon} </Button>
                                    <div>
                                        <EmojiPicker
                                            open={openEmojiPicker}
                                            onEmojiClick={
                                                (e) => {
                                                    setEmojiIcon(e.emoji)
                                                    setOpenEmojiPicker(false)
                                                }}
                                        />
                                    </div>
                                    <div className='mt-2'>
                                        <h2 className='text-black font-medium my-1'>
                                            Budget Name
                                        </h2>
                                        <Input placeholder='ex. Home Decor'
                                        defaultValue={budgetInfo?.name}
                                            onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className='mt-2'>
                                        <h2 className='text-black font-medium my-1'>
                                            Budget Amount
                                        </h2>
                                        <Input
                                            type='number'
                                            placeholder='ex. ₹5000'
                                            defaultValue={budgetInfo?.amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>

                                </div>

                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button
                                    disabled={!(name && amount)}
                                    onClick={() => onUpdateBudget()}
                                    className='mt-5 w-full'>Update Budget</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default EditBudget