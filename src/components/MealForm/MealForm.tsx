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
    date: Date.now(),
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | Date
  ) => {
    if (e instanceof Date) {
      setMeal(prev => ({...prev, date: e.getTime()}))
    } else {
      const {name, value} = e.target;
      setMeal(prev => ({...prev, [name]: value}));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="shadow my-3 d-flex flex-column p-3 rounded-3 h-100">
      <h3 className="text-center mb-3">{editingMeal ? 'Edit Meal' : 'New Meal Record'}</h3>
      {loading ? <Spinner/> : (
        <>
          <div className="py-2 input-group">
            <div className="input-group-text">Meal Time</div>
            <select
              className="form-control"
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
            <div className="input-group">
              <div className="input-group-text">Kcal</div>
              <input
                className="form-control"
                required
                placeholder="Number"
                name="kcal"
                onChange={handleChange}
                value={meal.kcal}
                type="number"
              />
              <DatePicker
                className="form-control"
                required
                onChange={handleChange}
                format="yyyy-MM-dd"
                value={new Date(meal.date)}
                clearIcon={null}
              />
            </div>
          </div>

          <div className="py-2 d-flex flex-column flex-grow-1">
            <label className="mb-2">Description</label>
            <textarea
              className="form-control flex-grow-1"
              placeholder="Describe your meal"
              required
              name="description"
              value={meal.description}
              onChange={handleChange}
            />
          </div>

          <div className="mt-2 d-flex justify-content-center gap-2">
            <button
              disabled={saving}
              type="submit"
              className="btn btn-primary btn-lg"
            >
              {saving && <ButtonSpinner/>}
              Save
            </button>
            <Link to='/' className={`btn btn-secondary btn-lg ${saving ? 'link-disabled' : ''}`}>
              Back
            </Link>
          </div>
        </>
      )}
    </form>
  );
};

export default MealForm;