import { Link } from "react-router-dom";
import { Button } from "welcome-ui/Button";
import { Card } from "welcome-ui/Card";
import { Tag } from "welcome-ui/Tag";
import { Text } from "welcome-ui/Text";

import type { Job } from "../../schemas/job";

export type JobCardProps = { job: Job };

export const JobCard = ({ job }: JobCardProps) => (
  <Card size="sm">
    <Card.Body>
      <div className="flex items-start justify-between gap-md">
        <div className="flex-1 min-w-0">
          <Link
            to={`/jobs/${job.id}`}
            className="no-underline hover:underline"
          >
            <Text variant="heading-md">{job.title}</Text>
          </Link>
          <Text variant="body-sm" className="mt-xs" lines={2}>
            {job.description}
          </Text>
          <div className="flex flex-wrap gap-xs mt-sm">
            <Tag size="md" variant="blue">
              {job.contract_type}
            </Tag>
            <Tag size="md" variant="light-blue">
              {job.office}
            </Tag>
            <Tag size="md" variant="green">
              {job.status}
            </Tag>
            <Tag size="md" variant="violet">
              {job.work_mode}
            </Tag>
          </div>
        </div>
        <Button as={Link} to={`/jobs/${job.id}/apply`} size="sm">
          Apply
        </Button>
      </div>
    </Card.Body>
  </Card>
);
