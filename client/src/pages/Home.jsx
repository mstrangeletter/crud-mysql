import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ImageCard from '../components/imageCard';

const MySwal = withReactContent(Swal);

function Home() {
    const [file, setFile] = useState(null);
    const [countryValue, setCountryValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [images, setImages] = useState([]);
    const {data, setData} = useState({});
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/images/get');
                const data = await response.json();
                setImages(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };
    
        fetchData();
    }, []);
    
    const fileHandler = (e) => {
        setFile(e.target.files[0]);
    };

    const sendHandler = () => {
        if (!file) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'You must select an image to upload',
            });
            return;
        }

        if (file.type !== 'image/png') {
            MySwal.fire({
                icon: 'error',
                title: 'Invalid file type',
                text: 'Please select a PNG image',
            });
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('country', countryValue);
        formData.append('description', descriptionValue);

        fetch('http://localhost:3001/images/post', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.text())
            .then((res) => {
                console.log(res);
                // Agregar SweetAlert2 para mostrar mensaje de éxito
                MySwal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Image uploaded successfully',
                });
            })
            .catch((err) => {
                console.log(err);
            });

        document.getElementById('fileInput').value = null;
        setFile(null);
        setCountryValue('');
        setDescriptionValue('');
    };
  

    return (
        <div className='container mt-5'>
            <div className='card p-3'>
                <div className='row m-2'>
                    <div className='col-12 m-3'>
                        <input
                            className='form-control'
                            type='text'
                            placeholder='País'
                            value={countryValue}
                            onChange={(e) => setCountryValue(e.target.value)}
                        />
                    </div>
                    <div className='col-12 m-3'>
                        <input
                            className='form-control'
                            type='text'
                            placeholder='Reseña'
                            value={descriptionValue}
                            onChange={(e) => setDescriptionValue(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-10'>
                        <input
                            id='fileInput'
                            className='m-3 form-control'
                            type='file'
                            accept='image/*'
                            onChange={fileHandler}
                            required
                        />
                    </div>
                    <div className='col-2 p-3'>
                        <button
                            onClick={sendHandler}
                            type='button'
                            className='btn btn-primary col-12'
                        >
                            Añadir
                        </button>
                    </div>
                </div>
            </div>
            <section>
                {
                images.map((image) => (
                   
                    <ImageCard
                        key={image.flag_id}
                        data={image.imagePath} // Asegura que estés pasando el campo correcto de la imagen
                        country={image.country}
                        description={image.flag_desc}
                    />


                ))}
            </section>
        </div>
    );
}

export default Home;
