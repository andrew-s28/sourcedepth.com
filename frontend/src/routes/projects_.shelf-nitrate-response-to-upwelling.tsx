import { createFileRoute } from "@tanstack/react-router";
import { FancyLink, Header2, Header3, Paragraph } from "~/components/mdx";
import { MonthlyNitratePlot } from "~/components/MonthlyNitratePlot";
import { NitratePlot } from "~/components/NitratePlot";
import { WindNitrateChlorophyllPlot } from "~/components/WindNitrateChloroPlot";

export const Route = createFileRoute(
  "/projects_/shelf-nitrate-response-to-upwelling"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const frontmatter = {
    title: "Shelf Nitrate Response to Upwelling",
    slug: "shelf-nitrate-response-to-upwelling",
    date: "2024-01-01",
    description:
      "Nitrate is an essential nutrient for phytoplankton growth, which forms the base of the marine food web. This project explores the response of Oregon shelf nitrate concentrations to upwelling events using newly available observational data from the Ocean Observatories Initiative.",
    tags: ["research", "oceanography", "nitrate", "upwelling"],
  };
  return (
    <>
      <div className="max-w-4xl mx-auto px-5 min-h-[calc(100vh-64px)]">
        <div className="mt-10 flex flex-col justify-start">
          <h1 className="text-4xl font-serif font-bold">{frontmatter.title}</h1>
          <h4 className="py-1 text-sm text-night-sky-950 dark:text-dawn-pink-100">
            {frontmatter.date === "" ? null : frontmatter.date}
          </h4>
          <p className="text-lg">{frontmatter.description}</p>
          <div className="my-5 mx-0 flex flex-row justify-center">
            <div className="min-h-0.5 max-h-0.5 w-2/3 bg-night-sky-800"></div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <Header2>Introduction</Header2>
          <Paragraph>
            Nitrate is an essential nutrient for phytoplankton growth, which
            forms the base of the marine food web. In the Northern California
            Current System, which spans from Northern California to British
            Columbia, upwelling events driven by southward along-shelf winds
            bring nutrient-rich waters to the surface, fueling primary
            productivity. Despite the importance of nitrate to ocean ecosystems,
            long-term, in situ measurements of nitrate concentrations have been
            limited.
          </Paragraph>
          <Paragraph>
            In order to address this gap in observational data, the Ocean
            Observatories Initiative (OOI){" "}
            <FancyLink href="https://oceanobservatories.org/array/coastal-endurance/">
              Coastal Endurance Array
            </FancyLink>
            has deployed a profiler equipped with an optical nitrate sensor (the{" "}
            <FancyLink href="https://www.seabird.com/nutrient-sensors/suna-v2-nitrate-sensor/family?productCategoryId=54627869922">
              SUNA V2
            </FancyLink>
            ) along the{" "}
            <FancyLink href="https://www.integratedecosystemassessment.noaa.gov/regions/california-current/newport-hydrographic-line">
              Newport Hydrographic Line (NHL)
            </FancyLink>
            , a long-term monitoring site off the coast of Oregon. This profiler
            collects relatively high-frequency, long-term nitrate data
            throughout the water column during the summer upwelling season,
            providing a unique opportunity to study the response of shelf
            nitrate on weekly to monthly time scales.
          </Paragraph>
          <Header2>The Importance of Coastal Upwelling</Header2>
          <Paragraph>
            Coastal upwelling is a process where deep, nutrient-rich waters are
            brought to the surface, driven by southward along-shelf winds. These
            deep waters are particularly rich in nitrate due to the accumulation
            of decomposed organic matter as the water travels throughout the
            ocean. When upwelling occurs, these nutrients are transported to the
            euphotic zone, where they can be utilized by phytoplankton, leading
            to increased primary productivity.
          </Paragraph>

          <figure>
            <img
              src="https://oceanservice.noaa.gov/facts/upwelling_960.jpg"
              alt="Coastal upwelling process"
              className="w-full h-auto my-4 rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-center text-gray-500">
              A schematic of the coastal upwelling process. Source:{" "}
              <FancyLink href="https://oceanservice.noaa.gov/facts/upwelling.html">
                NOAA Ocean Service
              </FancyLink>
            </figcaption>
          </figure>

          <Paragraph>
            The inner-shelf, a region where water depths are shallow (less than
            about 50 m), has sunlight penetrating all the way to the seafloor in
            addition to strong vertical mixing, making it a particularly
            productive area for phytoplankton growth. Observing the response of
            nitrate concentrations to upwelling events in this region is crucial
            for understanding the dynamics of marine ecosystems and the role of
            upwelling in supporting shelf ecosystems.
          </Paragraph>

          <Header2>Inner-shelf Nitrate Data</Header2>
          <Paragraph>
            The OOI Coastal Endurance Array profiler data is available from 2016
            to the present, providing a long-term record of nitrate
            concentration in the inner-shelf region. This data is shown in the
            figure below: the left plot is a time series of the nitrate over one
            summer upwelling season, with lighter colors representing shallower
            depths and darker colors representing deeper depths; the right plot
            is a depth profile of nitrate that you can select. Feel free to play
            around with it and see if you can notice any of the weekly or
            monthly variability!
          </Paragraph>
        </div>
        <figure>
          <div className="my-4">
            <NitratePlot />
          </div>
          <figcaption className="text-sm text-center text-gray-500">
            Nitrate concentrations from the OOI Coastal Endurance Array profiler
            along the Newport Hydrographic Line.
          </figcaption>
        </figure>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Header3>Weekly Timescale Variability</Header3>
          <Paragraph>
            The weekly timescale variability should be immediately obvious; the
            nitrate concentration often goes from greater than 30 mg/L to near 0
            mg/L in a matter of days. This is due to the variable winds that
            drive the upwelling process and strengthen and weaken on roughly
            5-10 day timescales.
          </Paragraph>
          <Paragraph>
            If you looked at some of the depth profiles, you may have noticed
            that sometimes there is a big difference between the nitrate
            concentration at the surface and the nitrate concentration at depth,
            while other times there is little difference. This is a reflection
            of the <em>stratification</em> of the water column, which is a
            measure of how well-mixed the water is vertically. When the water
            column is well-mixed, the nitrate concentration is similar
            throughout the water column; when it is stratified, there is a
            bigger difference between surface and bottom nitrate concentrations.
          </Paragraph>
          <Header3>Monthly Timescale Variability</Header3>
          <Paragraph>
            The monthly variability in nitrate concentration is a bit more
            difficult to pick out from the time series plot, but is still very
            important. In order to examine the monthly variability, we can look
            at the monthly mean nitrate concentrations from the inner shelf,
            which are shown in the figure below.
          </Paragraph>
        </div>
        <figure>
          <div className="my-4">
            <MonthlyNitratePlot />
          </div>
          <figcaption className="text-sm text-center text-gray-500">
            Monthly mean nitrate concentrations from the inner shelf.
          </figcaption>
        </figure>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Paragraph>
            Now, the seasonal cycle of nitrate concentration is much more clear:
            the mean nitrate concentration increases in the spring, before
            reaching a maximum in July and then decreasing for the rest of the
            summer and early fall. Interestingly, this seasonal cycle in nitrate
            aligns with seasonal cycles{" "}
            <FancyLink href="https://doi.org/10.1175/JPO-D-14-0025.1">
              also observed in physical water properties
            </FancyLink>
            , such as velocity, temperature, and salinity, which, like nitrate,
            are also controlled in part by the along-shelf winds through the
            upwelling process. This demonstrates the importance of coastal
            upwelling and therefore winds in delivering nutrients to the inner
            shelf.
          </Paragraph>
          <Header2>Nitrate, Wind, and Chlorophyll</Header2>
          <Paragraph>
            As we have seen, nitrate is highly variable on weekly, upwelling
            event timescales and has a similar seasonal evolution to other
            physical shelf variables. This suggests that nitrate is closely
            linked to the upwelling process and the winds that drive it. Nitrate
            is therefore an important link between the physical environment and
            the biological response of the shelf ecosystem. However, when
            upwelling circulation is strong, phytoplankton are quickly swept
            offshore and don&apos;t have time to develop into large blooms. This
            means that the relationship between nitrate and chlorophyll, an
            imperfect proxy of phytoplankton biomass, is not as straightforward
            as it would initially seem.
          </Paragraph>
          <Paragraph>
            Indeed, the competing influence of increased nitrate along with
            lower retention times in the inner shelf result in an{" "}
            <FancyLink href="https://doi.org/10.3389/fmars.2020.551562">
              optimal upwelling strength
            </FancyLink>
            , strong enough to supply sufficient nitrate to maintain blooms but
            not too strong as to transport all the phytoplankton offshore, away
            from the inner shelf. This can be seen in the figure below, which
            shows nitrate and chlorophyll concentrations as a function of a
            weighted average of the recent along-shelf winds (here, negative
            values correspond to the southward winds that drive upwelling). We
            can see that, as predicted, the maximum chlorophyll concentration
            indeed occurs at a moderate wind strength and nutrient
            concentration.
          </Paragraph>
        </div>
        <figure>
          <div className="my-4">
            <WindNitrateChlorophyllPlot />
          </div>
          <figcaption className="text-sm text-center text-gray-500">
            Wind, nitrate, and chlorophyll concentrations in the inner shelf
            during upwelling events.
          </figcaption>
        </figure>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Header2>Conclusion</Header2>
          <Paragraph>
            The OOI Coastal Endurance Array&apos;s profiler data has provided a
            unique opportunity to study the response of shelf nitrate
            concentrations to upwelling events. The data shows that nitrate is
            highly variable on weekly timescales and has a seasonal cycle that
            aligns with other physical shelf variables. The relationship between
            nitrate and chlorophyll is not straightforward, but rather has a
            maximum at moderate wind strengths, suggesting an optimal upwelling
            strength for phytoplankton growth. Together, these findings advance
            our understanding of the role of upwelling in supporting shelf
            ecosystems and the dynamics of marine food webs.
          </Paragraph>
          <Paragraph>
            Like all of my research, all of the data and analysis code for this
            project is available on my{" "}
            <FancyLink href="https://github.com/andrew-s28/shelf-nitrate-response-to-upwelling">
              GitHub
            </FancyLink>
            . The nitrate data can be downloaded via my{" "}
            <FancyLink href="https://github.com/andrew-s28/ooi-profiler-nitrate-retriever">
              OOI Nitrate Retriever
            </FancyLink>{" "}
            command line interface, which utilizes{" "}
            <FancyLink href="/blog/posts/uv-for-scientists">
              uv for managing script dependencies
            </FancyLink>{" "}
            . If you found this project interesting and want to get in touch, I
            look forward to hearing from you! You can find my contact
            information on below.
          </Paragraph>
        </div>
      </div>
    </>
  );
}
