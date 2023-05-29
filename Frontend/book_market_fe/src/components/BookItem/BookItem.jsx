import React, { useState, useEffect } from "react";
import './BookItem.css';
import he from 'he';

const BookItem = (props) => {
  const book = props.bookProps;
  const backupImgUrl = 'https://thumbs.gfycat.com/ConventionalOblongFairybluebird-max-1mb.gif'
  const [imageSrc, setImageSrc] = useState(book.img_m);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc

    img.onload = () => {
      setImageLoaded(true);
      setImageWidth(img.width);
      setImageHeight(img.height);
    };

    img.onerror = () => {
        setImageSrc(backupImgUrl)
      };
    }, [imageSrc]);

  const shouldDisplayImage =
    imageLoaded &&
    imageWidth !== null &&
    imageHeight !== null &&
    imageWidth >= 10 &&
    imageHeight >= 10;

  return (
    <div className="transform transition duration-200 hover:scale-125">
      {/* <img src={film.poster.split("/")[-1]} /> */}
      <div className="img-container">
        {shouldDisplayImage ? (
            <img src={imageSrc} alt="Image" className="img-item"/>
          ) : (
            <img src={backupImgUrl} alt="Fallback Image" className="img-backup"/>
          )
        }
      </div>
      <div className="title-container">
        <p className="text-sm">{he.decode(book.title)}</p>
      </div>
    </div>
  );
};

export default BookItem;