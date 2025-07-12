import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  GitBranch,
  Star,
  GitFork,
  CircleHelp,
  ExternalLink,
  CircleAlert,
} from "lucide-react";
import {
  api,
  GitHubRepository,
  GitHubWorkflow,
  GitHubWorkflowRun,
} from "~/utils/api";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Wrapper } from "~/components/page";

const loadRepositories = async () => {
  const repositories = await api.getRepositories();
  const workflows = await api.getWorkflows();
  const workflowRuns = await api.getWorkflowRuns();
  let repositoriesWithRuns: RepositoryWithRuns[] = [];
  // Map repositories to include workflow runs
  repositoriesWithRuns = repositories.results.map((repo) => {
    const repoWorkflows = workflows.results.filter(
      (workflow) => workflow.repository === repo.node_id
    );
    const repoWorkflowsWithRuns = repoWorkflows.map((workflow) => {
      const workflowRunsbyWorkflow = workflowRuns.results.filter(
        (run) => run.workflow === workflow.node_id
      );
      const mostRecentRun = workflowRunsbyWorkflow.reduce((latest, current) => {
        return new Date(current.updated_at) > new Date(latest.updated_at)
          ? current
          : latest;
      }, workflowRunsbyWorkflow[0]) as GitHubWorkflowRun | undefined; // undefined if no runs exist
      if (!mostRecentRun) {
        return {
          ...workflow,
          runs: [],
        };
      }
      return {
        ...workflow,
        runs: [mostRecentRun],
      };
    });
    const repoWorkflowsWithRunsFiltered = repoWorkflowsWithRuns.filter(
      (workflow) => workflow.node_id !== "W_kwDOO6JGD84KA1C6" // manually excluding a specific workflow
    );
    return {
      ...repo,
      workflows: repoWorkflowsWithRunsFiltered,
      isExpanded: false, // Initialize expanded state
      isLoading: false, // Initialize loading state
    };
  });
  return { repositoriesWithRuns };
};

export const Route = createFileRoute("/actions-dashboard")({
  loader: loadRepositories,
  component: RouteComponent,
});

interface WorkflowWithRuns extends GitHubWorkflow {
  runs?: GitHubWorkflowRun[];
}

interface RepositoryWithRuns extends GitHubRepository {
  workflows?: WorkflowWithRuns[];
  isExpanded?: boolean;
  isLoading?: boolean;
}

function getStatusIcon(status: string, conclusion?: string) {
  if (status === "in_progress" || status === "queued") {
    return <Clock className="w-4 h-4 text-yellow-500" />;
  }

  if (conclusion === "success") {
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  }

  if (
    conclusion === "failure" ||
    conclusion === "timed_out" ||
    conclusion === "cancelled"
  ) {
    return <XCircle className="w-4 h-4 text-red-500" />;
  }

  if (conclusion === "unknown") {
    return <CircleHelp className="w-4 h-4 text-gray-500" />;
  }

  return <Clock className="w-4 h-4 text-gray-500" />;
}

function getStatusBadge(status: string, conclusion?: string) {
  if (status === "in_progress" || status === "queued") {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-50 text-yellow-700 border-yellow-200"
      >
        <Clock className="w-3 h-3" />
        {status === "in_progress" ? "Running" : "Queued"}
      </Badge>
    );
  }

  if (conclusion === "success") {
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200"
      >
        <CheckCircle className="w-3 h-3" />
        Success
      </Badge>
    );
  }

  if (conclusion === "failure") {
    return (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3" />
        Failed
      </Badge>
    );
  }

  if (conclusion === "cancelled") {
    return (
      <Badge
        variant="outline"
        className="bg-gray-50 text-gray-700 border-gray-200"
      >
        <XCircle className="w-3 h-3" />
        Cancelled
      </Badge>
    );
  }

  if (conclusion === "unknown") {
    return (
      <Badge
        variant="outline"
        className="bg-gray-50 text-gray-700 border-gray-200"
      >
        <CircleHelp className="w-3 h-3" />
        Unknown
      </Badge>
    );
  }

  return <Badge variant="outline">{conclusion || status || "Unknown"}</Badge>;
}

interface RepositoryCardProps {
  repo: RepositoryWithRuns;
  onToggle: (node_id: string) => void;
}

function RepositoryCard({ repo, onToggle }: RepositoryCardProps) {
  const getOverallStatus = () => {
    if (!repo.workflows || repo.workflows.length === 0) {
      return {
        icon: <CircleHelp className="w-4 h-4 text-gray-400" />,
        text: "N/A",
      };
    }

    const hasFailure = repo.workflows.some((workflow) =>
      workflow.runs?.some((run) => run.conclusion === "failure")
    );
    const hasInProgress = repo.workflows.some((workflow) =>
      workflow.runs?.some((run) => run.status === "in_progress")
    );
    const allSuccess = repo.workflows.every((workflow) =>
      workflow.runs?.every(
        (run) => run.conclusion === "success" || run === undefined
      )
    );

    if (hasFailure) {
      return {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
        text: "Failing",
      };
    }
    if (hasInProgress) {
      return {
        icon: <Clock className="w-4 h-4 text-yellow-500" />,
        text: "Running",
      };
    }
    if (allSuccess) {
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        text: "Passing",
      };
    }

    return {
      icon: (
        <CircleAlert className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
      ),
      text: "Mixed",
    };
  };

  const overallStatus = getOverallStatus();

  return (
    <Card className="transition-all duration-200 hover:shadow-md bg-gray-50 dark:bg-gray-800">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => {
          onToggle(repo.node_id);
        }}
      >
        <div className="sm:flex sm:flex-row items-center justify-between ">
          <div className="flex items-center gap-3 justify-between sm:justify-start">
            <div className="flex items-center gap-3 align-left">
              <motion.div
                animate={{ rotate: repo.isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </motion.div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {repo.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                  {repo.full_name}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col justify-right items-center gap-2 py-1 sm:py-0 sm:hidden">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Star className="w-4 h-4" />
                {repo.stargazers_count}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <GitFork className="w-4 h-4" />
                {repo.forks_count}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center ">
            <div className="flex items-center gap-2 py-1 hidden sm:flex">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Star className="w-4 h-4" />
                {repo.stargazers_count}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <GitFork className="w-4 h-4" />
                {repo.forks_count}
              </div>
            </div>

            <div className="flex items-center gap-2 pl-4 py-1 sm:py-0">
              <div className="flex items-center gap-2">
                {overallStatus.icon}
                <span className="text-sm font-medium">
                  {overallStatus.text}
                </span>
              </div>
              <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>
              <div className="flex items-center gap-2">
                <Link
                  to={repo.html_url}
                  className="text-sm text-night-sky-950 dark:text-dawn-pink-100 font-semibold border-blue-800 transition-all duration-50 hover:text-blue-800 dark:hover:text-blue-400"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card toggle
                  }}
                >
                  View Repository
                  <span className="inline-flex align-middle">
                    <ExternalLink size={14} className="ml-0.5 mb-0.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {repo.isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent className="pt-0">
            {repo.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Loading workflow runs...
                </span>
              </div>
            ) : repo.workflows && repo.workflows.length > 0 ? (
              repo.workflows.map((workflow) =>
                workflow.runs && workflow.runs.length > 0 ? (
                  <div key={workflow.id} className="py-1">
                    {workflow.runs.map((run, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(run.status, run.conclusion)}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              <Link to={workflow.html_url}>
                                {workflow.name}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(run.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(run.status, run.conclusion)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div key={workflow.id} className="py-1">
                    <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon("unkown", "unknown")}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            <Link to={workflow.html_url}>{workflow.name}</Link>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            No runs available
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge("unknown", "unknown")}
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No workflows found for this repository
              </div>
            )}
          </CardContent>
        </motion.div>
      )}
    </Card>
  );
}

function RouteComponent() {
  const [repositoriesWithRuns, setRepositoriesWithRuns] = useState<
    RepositoryWithRuns[]
  >(Route.useLoaderData().repositoriesWithRuns);

  const toggleRepository = (repoNodeID: string) => {
    setRepositoriesWithRuns((prev) =>
      prev.map((repo) => {
        if (repo.node_id === repoNodeID) {
          const wasExpanded = repo.isExpanded;
          const updatedRepo = { ...repo, isExpanded: !wasExpanded };

          // Load workflow runs if expanding and not already loaded
          if (!wasExpanded && !repo.workflows) {
            updatedRepo.isLoading = true;
          }

          return updatedRepo;
        }
        return repo;
      })
    );
  };

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-8"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-2">
            GitHub Actions Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor workflow runs and repository status across your GitHub
            repositories.
          </p>
        </div>

        {repositoriesWithRuns.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No repositories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No GitHub repositories are currently available in the system.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {repositoriesWithRuns.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <RepositoryCard repo={repo} onToggle={toggleRepository} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </Wrapper>
  );
}
