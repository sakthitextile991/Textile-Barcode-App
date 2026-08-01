function UserStats({
  statistics,
}) {

  const cards = [

    {
      label:
        "Total Users",

      value:
        statistics.total,

      description:
        "All registered accounts",

      icon:
        "👥",
    },

    {
      label:
        "Administrators",

      value:
        statistics.admins,

      description:
        "Users with admin access",

      icon:
        "🛡️",
    },

    {
      label:
        "Active Users",

      value:
        statistics.active,

      description:
        "Accounts currently enabled",

      icon:
        "✓",
    },

    {
      label:
        "Inactive Users",

      value:
        statistics.inactive,

      description:
        "Accounts currently disabled",

      icon:
        "◷",
    },

  ];


  return (

    <section
      className="
        grid
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >

      {cards.map(
        (card) => (

          <article
            key={
              card.label
            }
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-500
                  "
                >

                  {card.label}

                </p>


                <p
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-slate-900
                  "
                >

                  {card.value}

                </p>

              </div>


              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-100
                  text-lg
                "
              >

                {card.icon}

              </div>

            </div>


            <p
              className="
                mt-4
                text-xs
                text-slate-400
              "
            >

              {card.description}

            </p>

          </article>

        )
      )}

    </section>

  );

}


export default UserStats;