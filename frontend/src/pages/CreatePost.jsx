import React from 'react'
import { useEffect , useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { preview } from '../assets';
import {getRandomPrompt } from '../utils';
import {FormField , Loader} from '../components'

const CreatePost = () => {
    const navigate = useNavigate(); //allow to navigate to Home  page once post is created
    const [form, setform] = useState({
        name: '',
        prompt:'',
        photo:''})
    // generatingImg = used when we sar making contact with an APi and while we are waiting to get back image
    const [generatingImg, setgeneratingImg] = useState(false); 
    const [loading, setloading] = useState(false);

    const generateImage = async () => {
        if(form.prompt){
            try {
                setgeneratingImg(true);
                const response = await fetch('http://localhost:8080/api/v1/dalle', {
                    method: 'POST',
                    headers:{
                        'Content-Type' :'application/json',

                    },
                    body: JSON.stringify({prompt: form.prompt}),
                })

                const data = await response.json();
                setform({...form, photo: `data:image/jpeg;base64,${data.photo}`})
            } catch (error) {
                alert(error); 
            }
            finally{
                setgeneratingImg(false);
            }
        }
        else{
            alert("Please Enter a Prompt");
        }
    }
    const handleSubmit = async(e) => {
        e.preventDefault(); // prevents a browser to automatically reload the application
       
        if(form.prompt && form.photo)
        {
            setloading(true);

            try {
                console.log("inside try")
                const response = await fetch('http://localhost:8080/api/v1/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify(form)
            })
        
            await response.json();
            navigate('/');
            
        }catch (error) {
                alert(error)
            }finally{
                setloading(false);
            }
        }
        else{
            alert("Please enter a prompt ang generate an image ")
        }
    }

    const handleChange = (e) => {
        setform({...form, [e.target.name] : e.target.value})
    }

    const handleSurpriseMe = (e) => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setform({...form, prompt:randomPrompt })
    }
  return (
    <section className='max-w-7xl mx-auto'>
        <div>
            <h1 className='font-extrabold text-[#222328] text-[32px]'> Create</h1>
            <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]'> Create imaginative and visually stunning images through DAL-E Ai and share tham with community</p>
        </div>

        <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
           <div children='flex flex-col gap-5'>
             <FormField
              LabelName = "Your Name"
              type="text"
              name="name"
              placeholder="Minal Patil"
              value={form.name} 
              handleChange={handleChange}
             />


            <FormField
              LabelName = "Prompt"
              type="text"
              name="prompt"
              placeholder="A Dinosaur exploring Cape Town, photography'"
              value={form.prompt} 
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
             />
           

        <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-80 p-3 h-64 flex justify-center items-center'>
          {form.photo ? (
          <img
               src={form.photo}
               alt={form.prompt}
               className='w-full h-full object-contain' /> 
             ) : (
              <img
               src={preview}
               alt='preview'
               className='w-9/12 h-9/12 object-contain opacity=40' /> 
               )}

               {generatingImg && (
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0,5)] rounded-lg'>
                    <Loader />
                </div>
               )}
            </div>
        </div>

        <div className='mt-5 flex gap-5'>
            <button type='button'
            onClick={generateImage}
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
                {generatingImg ? 'Generating...' : 'Generate'}
            </button>
        </div>

        <div className='mt-10'>
            <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you can share it with others in the community </p>
             <button type='submit' className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-205 text-center'>
                {loading ? "Sharing...": "Share with the community"}
                </button>   
        </div>
        </form>
    </section>
    
  )
}

export default CreatePost;