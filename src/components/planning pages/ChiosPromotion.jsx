import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChiosPromotion = ({ user, setUser, onPromotionClick }) => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/promotion', {
          withCredentials: true,
        });
        const transformedPromotions = response.data.map((item) => ({
          id: item.Promotion.id,
          name: item.Promotion.name,
          speciality: item.Speciality.name,
        }));
        setPromotions(transformedPromotions);
      } catch (err) {
        console.error('Failed to fetch promotions:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUser(null);
          navigate('/login');
        } else {
          alert('Failed to fetch promotions');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [navigate, user, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="p-6">
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4">Promotion List</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Speciality
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                    No promotions found.
                  </td>
                </tr>
              ) : (
                promotions.map((promotion) => (
                  <tr
                    key={promotion.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => onPromotionClick(promotion.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{promotion.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{promotion.speciality}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChiosPromotion;