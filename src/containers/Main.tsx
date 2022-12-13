import React from 'react';
import {Link} from "react-router-dom";
import {MealWithId} from "../types";
import MealView from "../components/MealView/MealView";
import Spinner from "../components/Spinner/Spinner";
import ButtonSpinner from "../components/Spinner/ButtonSpinner";

export const isItToday = (ms: number) => {
  const d = new Date();
  const r = new Date(ms);
  return d.getFullYear() === r.getFullYear() &&
    d.getDate() === r.getDate() &&
    d.getMonth() === r.getMonth();
};

interface Props {
  mealRecords: MealWithId[] | null;
  reload: () => void;
  loading: boolean;
}

const Main: React.FC<Props> = ({mealRecords, reload, loading}) => {
  const totalCalories = mealRecords
    ?.filter((rec) => isItToday(rec.date))
    .reduce((acc, rec) => acc + rec.kcal, 0);

  const kcalOutput = loading ? (
    <>Total calories today: <ButtonSpinner/> kcal</>
  ) : !loading && !mealRecords ? (
    <>No meal records</>
  ) : (
    <>
      Total calories today:
      <strong className="text-danger"> {totalCalories} </strong>
      kcal
    </>
  );

  return (
    <>
      <div className="py-3 px-2 d-flex justify-content-between align-items-center">
        <div>
          {kcalOutput}
        </div>
        <Link
          to="/meal-records/create"
          type="button"
          className="btn btn-primary"
        >
          Add new meal
        </Link>
      </div>
      <div className="border flex-grow-1 shadow p-2 overflow-auto">
        {loading && !mealRecords ? (
          <Spinner/>
        ) : (
          <>
            {mealRecords && mealRecords.map((meal) => (
              <MealView
                key={meal.id}
                reload={reload}
                {...meal}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Main;