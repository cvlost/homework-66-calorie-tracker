import React, {useCallback, useEffect, useState} from 'react';
import {Meal, MealMutation} from "../../types";
import ButtonSpinner from "../Spinner/ButtonSpinner";
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosApi from "../../axiosApi";
import Spinner from "../Spinner/Spinner";
import DatePicker from 'react-date-picker';

interface Props {
  reload: () => void;
  editingMeal?: Meal;
}

const MealForm: React.FC<Props> = ({editingMeal, reload}) => {
  const initialState: MealMutation = {
    description: '',
    kcal: '',
    time: '',
    date: new Date().toISOString(),
  };

  const state: MealMutation = editingMeal ? {
    ...editingMeal,
    kcal: editingMeal.kcal.toString(),
  } : initialState;

  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [meal, setMeal] = useState<MealMutation>(state);
  const navigate = useNavigate();

  const getMeal = useCallback(async () => {
    if (id) {
      try {
        setLoading(true);
        const response = await axiosApi.get<Meal | null>(`/meal-records/${id}.json`);
        const newMeal = response.data;

        if (!newMeal) {
          return;
        }

        setMeal({
          ...newMeal,
          kcal: newMeal.kcal.toString(),
        });
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  const createMeal = useCallback(async () => {
    try {
      setSaving(true);
      await axiosApi.post<Meal>('/meal-records.json', {
        ...meal,
        kcal: parseFloat(meal.kcal),
      });
      await reload();
      navigate('/');
    } finally {
      setSaving(false);
    }
  }, [meal, navigate, reload]);

  const editMeal = useCallback(async () => {
    try {
      setSaving(true);
      await axiosApi.put<Meal>(`/meal-records/${id}.json`, {
        ...meal,
        kcal: parseFloat(meal.kcal),
      });
      await reload();
    } finally {
      setSaving(false);
    }
  }, [id, meal, reload]);

  useEffect(() => {
    if (id) void getMeal();
  }, [getMeal, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    id ? editMeal() : createMeal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>  | Date
  ) => {
    if (e instanceof Date) {
      setMeal(prev => ({...prev, date: e.toISOString()}))
    } else {
      const {name, value} = e.target;
      setMeal(prev => ({...prev, [name]: value}));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingMeal ? 'Edit' : 'Create'}</h3>
      {loading ? <Spinner/> : (
        <>
          <div className="py-2">
            <select
              name="time"
              required
              value={meal.time}
              onChange={handleChange}
            >
              <option value="" disabled>choose...</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Snack">Snack</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>

          <div className="py-2">
        <textarea
          required
          name="description"
          value={meal.description}
          onChange={handleChange}
        />
          </div>

          <div className="py-2">
            <input
              required
              name="kcal"
              onChange={handleChange}
              value={meal.kcal}
              type="number"
            />
          </div>

          <div className="py-2">
            <DatePicker
              required
              onChange={handleChange}
              format="yyyy-MM-dd"
              value={new Date(meal.date)}
              clearIcon={null}
            />
          </div>

          <div className="py-2">
            <button
              disabled={saving}
              type="submit"
              className="btn btn-primary"
            >
              {saving && <ButtonSpinner/>}
              Save
            </button>
            <Link to='/' className={`btn btn-secondary ${saving ? 'link-disabled' : ''}`} >
              Back
            </Link>
          </div>
        </>
      )}
    </form>
  );
};

export default MealForm;