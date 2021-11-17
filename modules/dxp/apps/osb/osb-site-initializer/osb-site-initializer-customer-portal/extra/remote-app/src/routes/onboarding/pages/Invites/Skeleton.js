import Skeleton from '~/common/components/Skeleton';
import Layout from '../../components/Layout';

const InvitesSkeleton = () => {
	return (
		<Layout
			className="align-items-center d-flex flex-column pt-5 px-6"
			headerSkeleton={
				<div className="p-4">
					<Skeleton className="mb-4 mt-2" height={16} width={425} />

					<Skeleton className="mb-5" height={8} width={480} />

					<Skeleton className="mb-2" height={8} width={64} />

					<Skeleton className="mb-5" height={8} width={246} />

					<div className="row">
						<div className="col">
							<Skeleton className="mb-2" height={8} width={64} />

							<Skeleton.Rounded height={48} width={248} />

							<Skeleton className="mb-2 mt-4" height={8} width={64} />

							<Skeleton.Rounded height={48} width={248} />

							<Skeleton className="mb-2 mt-4" height={8} width={64} />

							<Skeleton.Rounded height={48} width={248} />
						</div>

						<div className="col">
							<Skeleton className="mb-2" height={8} width={64} />

							<Skeleton.Rounded height={48} width={248} />

							<Skeleton className="mb-2 mt-4" height={8} width={64} />

							<Skeleton.Rounded height={48} width={248} />

							<Skeleton className="mb-2 mt-4" height={8} width={64} />

							<Skeleton.Rounded height={48} width={248} />
						</div>
					</div>

					<Skeleton className="mb-4 mt-5" height={8} width={320} />

					<Skeleton className="mb-3" height={8} width={520} />

					<Skeleton className="mb-5" height={8} width={400} />

					<div className="justify-content-around row">
						<div className="align-self-center col">
							<Skeleton height={8} width={80} />
						</div>

						<div className="col-auto">
							<Skeleton.Rounded height={48} width={110} />
						</div>
					</div>


				</div>
			}
		>
		</Layout>
	);
};
export default InvitesSkeleton;
