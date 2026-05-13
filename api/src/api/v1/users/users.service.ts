import { User, IUser } from './users.model'
import { UpdateProfileDto } from './users.schema'
import { AppError } from '../../../utils/AppError'
import { buildPaginationMeta } from '../../../utils/response'
import { trackDb } from '../../../lib/db'

interface ClerkUserData {
  id:             string
  username?:      string | null
  emailAddresses: { emailAddress: string }[]
  firstName?:     string | null
  lastName?:      string | null
  imageUrl?:      string
}

export class UserService {
  static async syncFromClerk(data: ClerkUserData): Promise<IUser> {
    const email    = data.emailAddresses[0]?.emailAddress ?? ''
    const username = data.username ?? email.split('@')[0]

    return trackDb('findOneAndUpdate', 'users', () =>
      User.findOneAndUpdate(
        { clerkId: data.id },
        {
          $setOnInsert: { clerkId: data.id },
          $set: { username, email, firstName: data.firstName ?? '', lastName: data.lastName ?? '', avatarUrl: data.imageUrl ?? '' },
        },
        { upsert: true, new: true, runValidators: true }
      )
    ) as Promise<IUser>
  }

  static async updateFromClerk(data: ClerkUserData): Promise<void> {
    await trackDb('findOneAndUpdate', 'users', () =>
      User.findOneAndUpdate(
        { clerkId: data.id },
        { $set: { username: data.username ?? undefined, email: data.emailAddresses[0]?.emailAddress ?? undefined, firstName: data.firstName ?? undefined, lastName: data.lastName ?? undefined, avatarUrl: data.imageUrl ?? undefined } }
      )
    )
  }

  static async handleDeletion(clerkId: string): Promise<void> {
    await trackDb('findOneAndUpdate', 'users', () =>
      User.findOneAndUpdate(
        { clerkId },
        { $set: { isActive: false, email: `deleted-${clerkId}@deleted.invalid`, username: `deleted-${clerkId}`, firstName: 'Deleted', lastName: 'User', avatarUrl: '', bio: '', github: '', twitter: '', website: '' } }
      )
    )
  }

  static async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      trackDb('find', 'users', () => User.find({ isActive: { $ne: false } }).skip(skip).limit(limit).lean()),
      trackDb('countDocuments', 'users', () => User.countDocuments({ isActive: { $ne: false } })),
    ])
    return { data, meta: buildPaginationMeta(total, page, limit) }
  }

  static async findByClerkId(clerkId: string): Promise<IUser> {
    const user = await trackDb('findOne', 'users', () => User.findOne({ clerkId }))
    if (!user) throw AppError.notFound('User not found')
    return user
  }

  static async findByUsername(username: string): Promise<IUser> {
    const user = await trackDb('findOne', 'users', () =>
      User.findOne({ username: username.toLowerCase() })
    )
    if (!user) throw AppError.notFound('User not found')
    return user
  }

  static async updateProfile(clerkId: string, data: UpdateProfileDto): Promise<IUser> {
    const user = await trackDb('findOneAndUpdate', 'users', () =>
      User.findOneAndUpdate({ clerkId }, { $set: data }, { new: true, runValidators: true })
    )
    if (!user) throw AppError.notFound('User not found')
    return user
  }
}
