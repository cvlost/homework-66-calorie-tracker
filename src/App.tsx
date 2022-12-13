import React, {useCallback, useEffect, useState} from 'react';
import Layout from "./components/Layout/Layout";
import {Route, Routes} from "react-router-dom";
import NotFound from "./components/NotFound/NotFound";
import Main from "./containers/Main";
import MealForm from "./components/MealForm/MealForm";
import {ApiMealList, MealWithId} from "./types";
import axiosApi from "./axiosApi";
import './App.css';

function App() {
  const [meals, setMeals] = useState<MealWithId[] | null>(null);
  const [loading, setLoading] = useState(false);

  const getMeals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get<ApiMealList | null>('/meal-records.json?orderBy="date"');
      const data = response.data;

      if (!data) {
        return setMeals(null);
      }

      const newMeals: MealWithId[] = Object.keys(data).map((id) => {
        return {
          id,
          ...data[id]
        }
      });
      newMeals.sort((a, b) => b.date - a.date);
      setMeals(newMeals);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void getMeals();
  }, [getMeals]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Main loading={loading} mealRecords={meals} reload={getMeals}/>}/>
        <Route path="/meal-records/create" element={<MealForm reload={getMeals}/>}/>
        <Route path="/meal-records/:id/edit" element={<MealForm reload={getMeals}/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Layout>
  );
}

export default App;
