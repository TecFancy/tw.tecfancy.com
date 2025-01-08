import React from 'react';
import GlobalClientLayout from "@/app/layouts/global-client";
import Card from "@/app/components/card";
import CreateTwForm from "@/app/components/create-tw-form";

const Home = () => {
  return (
      <GlobalClientLayout>
          <Card>
              <CreateTwForm />
          </Card>
      </GlobalClientLayout>
  );
};

export default Home;
