import React from 'react';
import {Link} from "react-router-dom";
import {MealWithId} from "../types";
import MealView from "../components/MealView";
import Spinner from "../components/Spinner/Spinner";
import ButtonSpinner from "../components/Spinner/ButtonSpinner";

interface Props {
  mealRecords: MealWithId[] | null;
  reload: () => void;
  loading: boolean;
}

const Main: React.FC<Props> = ({mealRecords, reload, loading}) => {
  const kcalOutput = loading ? (
    <>Total calories <ButtonSpinner/> kcal</>
  ) : !loading && !mealRecords ? (
    <>no meal records</>
  ) : (
    <>
      Total calories
      <strong className="text-danger"> {mealRecords?.reduce((acc, rec) => acc + rec.kcal, 0)} </strong>
      kcal
    </>
  );

  return (
    <div className="col d-flex flex-column pb-2 h-100">
      <div className="py-2 d-flex justify-content-between align-items-center">
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
        {loading ? (
          <Spinner />
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
    </div>
  );
};

export default Main;