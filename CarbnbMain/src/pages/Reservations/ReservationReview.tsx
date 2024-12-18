import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config.js';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={`transition-colors duration-200 ${
              index <= (hover || rating)
                ? 'text-warning'
                : 'text-gray-300'
            }`}
            onClick={() => onRatingChange(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <Star 
              fill={index <= (hover || rating) ? '#ffa70b' : 'none'}
              size={32}
              className="cursor-pointer"
            />
          </button>
        );
      })}
    </div>
  );
};

interface FormData {
  reviewId: string;
  rating: string;
  comment: string;
}

const ReviewEdit = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState<FormData>({
    reviewId: '',
    rating: '',
    comment: ''
  });

  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/member/reviews/show/${id}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            reviewId: data.reviewId || '',
            comment: data.comment || '',
            rating: data.rating != null ? data.rating.toString() : '',
          });
        
          setRating(data.rating || 0);
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading data.');
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating == 0 || rating == null) {
      toast.error('Rating should not be empty');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      const jsonData = {
        comment: formData.comment,
        rating: rating
      };

      const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      formDataToSend.append('review', jsonBlob);

      const response = await fetch(`${BASE_URL}/member/reviews/update/${id}`, {
        method: "PUT",
        credentials: 'include',
        body: formDataToSend,
      });

      if (response.ok) {
        const updated = await response.json();

        if(updated == 1) {
          toast.success('Created review successfully');
          navigate(`/reservations/${id}`);
        } else if (updated === 2) {
          toast.success('Updated successfully');
        } else {
          toast.error('Failed to update');
        }
      } else {
        console.error("Failed to update:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete?');
    if (!isConfirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/member/reviews/remove/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result) {
          navigate(`/reservations/${id}`);
          toast.success('Deleted review successfully');
        } else {
          toast.error('Failed to delete');
        }
      } else {
        throw new Error(`Failed to delete. Status: ${response.status}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };
  
  return (
    <>
      {error ? (
      <div className="display-error">
        {error}
      </div>
      ) : (
      <div className="max-w-[50rem] mx-auto">
        <h2 className="text-title-md2 font-semibold text-black mb-8">
          {formData.reviewId ? 'Edit Review' : 'Add Review'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-7">
            <label className="mb-2.5 block text-black">
              Rating <span className="text-meta-1">*</span>
            </label>

            <StarRating 
              rating={rating}
              onRatingChange={(selectedRating) => {
                setRating(selectedRating);
                setFormData(prev => ({ ...prev, rating: selectedRating.toString() }));
              }}
            />
          </div>

          <div className="mb-7">
            <label className="mb-2.5 block text-black">
              Comment
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={6}
              placeholder="Enter comment"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-gray-400 active:border-gray-400"
            ></textarea>
          </div>

          <div className="flex items-center gap-4 mt-10">
            <button 
              type="submit"
              className="flex justify-center rounded-full bg-gray-900 py-3 px-12 font-medium text-white hover:bg-opacity-90"
            >
              Submit
            </button>

            {formData.reviewId ? (
            <button
              type="button"
              className="flex justify-center rounded-full border border-red-500 py-3 px-12 font-medium text-red-500 hover:bg-red-50"
              onClick={handleDelete}
            >
              Delete
            </button>
            ) : null}
          </div>
        </form>
      </div>
      )}
    </>
  );
};

export default ReviewEdit;