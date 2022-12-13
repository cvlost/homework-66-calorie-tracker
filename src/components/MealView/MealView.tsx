import React, {useState} from 'react';
import {MealWithId} from "../../types";
import {Link} from "react-router-dom";
import axiosApi from "../../axiosApi";
import ButtonSpinner from "../Spinner/ButtonSpinner";
import {isItToday} from "../../containers/Main";

interface Props extends MealWithId {
  reload: () => void;
}

const MealView: React.FC<Props> = ({description, time, kcal, id, reload, date}) => {
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    try {
      setDeleting(true);
      await axiosApi.delete(`/meal-records/${id}.json`);
      await reload();
    } finally {
      setDeleting(false);
    }
  };

  const isToday = isItToday(date);

  return (
    <div className={`card mb-3 ${isToday ? 'bg-primary bg-opacity-10' : ''}`}>
      <div className="card-header d-flex justify-content-between">
        <span className="fw-bold text-secondary">{time}</span>
        <span><strong className="text-danger">{kcal}</strong> kcal</span>
        <small className={`${isToday ? '' : 'fst-italic text-secondary'}`}>
          {isToday && (<span className="fw-bold me-2">Today</span>)}
          {new Date(date).toLocaleDateString('en', {dateStyle: "medium"})}
        </small>
      </div>
      <div className="card-body">
        {description}
      </div>
      <div className="card-footer d-flex gap-2 justify-content-end">
        <Link
          to={`/meal-records/${id}/edit`}
          type="button"
          className={`btn btn-primary ${deleting ? 'link-disabled' : ''}`}
        >
          Edit
        </Link>
        <button
          disabled={deleting}
          type="button"
          className="btn btn-danger"
          onClick={remove}
        >
          {deleting && <ButtonSpinner/>}
          Delete
        </button>
      </div>
    </div>
  );
};

export default MealView;