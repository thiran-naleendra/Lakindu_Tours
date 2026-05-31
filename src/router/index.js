import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { getUserProfile } from '../services/profile'
import { getModules } from '../services/modules'

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
    routes: [
        // Public Routes
        {
            path: '/',
            component: () => import('../layouts/PublicLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('../views/public/HomeView.vue'),
                    meta: { transparentHeader: true }
                },
                {
                    path: 'tours/:id',
                    name: 'tour-detail-public',
                    component: () => import('../views/public/TourDetailView.vue'),
                    meta: { transparentHeader: true, moduleId: 'tours' }
                },
                {
                    path: 'destinations',
                    name: 'destinations-list',
                    component: () => import('../views/public/DestinationsView.vue'),
                    meta: { moduleId: 'destinations' }
                },
                {
                    path: 'destinations/:id',
                    name: 'destination-detail-public',
                    component: () => import('../views/public/DestinationDetailView.vue'),
                    meta: { transparentHeader: true, moduleId: 'destinations' }
                },
                {
                    path: 'packages',
                    name: 'packages-list',
                    component: () => import('../views/public/PackagesView.vue'),
                    meta: { transparentHeader: true, moduleId: 'tours' }
                },
                {
                    path: 'about',
                    name: 'about',
                    component: () => import('../views/public/AboutView.vue'),
                    meta: { transparentHeader: true }
                },
                {
                    path: 'contact',
                    name: 'contact',
                    component: () => import('../views/public/ContactView.vue'),
                    meta: { transparentHeader: true }
                },
                {
                    path: 'fleet',
                    name: 'fleet',
                    component: () => import('../views/public/FleetView.vue'),
                    meta: { transparentHeader: true, moduleId: 'fleet' }
                },
                {
                    path: 'fleet-booking',
                    name: 'fleet-booking',
                    component: () => import('../views/public/FleetBookingView.vue'),
                    meta: { moduleId: 'fleet' }
                },
                {
                    path: 'hotels',
                    name: 'hotels',
                    component: () => import('../views/public/HotelsView.vue'),
                    meta: { moduleId: 'hotels' }
                },
                {
                    path: 'thank-you',
                    name: 'thank-you',
                    component: () => import('../views/public/ThankYouView.vue'),
                    meta: { transparentHeader: true }
                },
                {
                    path: 'tailor-made',
                    name: 'tailor-made',
                    component: () => import('../views/public/TailorMadeView.vue'),
                    meta: { transparentHeader: false }
                },
                {
                    path: 'terms',
                    name: 'terms',
                    component: () => import('../views/public/TermsView.vue'),
                    meta: { transparentHeader: true }
                }
            ]
        },

        // Admin Routes
        {
            path: '/admin',
            component: () => import('../layouts/AdminLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/DashboardView.vue')
                },
                {
                    path: 'tours',
                    name: 'tours',
                    component: () => import('../views/ToursListView.vue'),
                    meta: { moduleId: 'tours' }
                },
                {
                    path: 'tours/create',
                    name: 'tour-create',
                    component: () => import('../views/TourCreateView.vue'),
                    meta: { moduleId: 'tours' }
                },
                {
                    path: 'tours/edit/:id',
                    name: 'tour-edit',
                    component: () => import('../views/TourCreateView.vue'),
                    meta: { moduleId: 'tours' }
                },
                {
                    path: 'destinations',
                    name: 'admin-destinations',
                    component: () => import('../views/DestinationsListView.vue'),
                    meta: { moduleId: 'destinations' }
                },
                {
                    path: 'destinations/create',
                    name: 'destination-create',
                    component: () => import('../views/DestinationCreateView.vue'),
                    meta: { moduleId: 'destinations' }
                },
                {
                    path: 'destinations/edit/:id',
                    name: 'destination-edit',
                    component: () => import('../views/DestinationCreateView.vue'),
                    meta: { moduleId: 'destinations' }
                },
                {
                    path: 'reviews',
                    name: 'reviews',
                    component: () => import('../views/ReviewManagementView.vue'),
                    meta: { moduleId: 'reviews' }
                },
                {
                    path: 'messages',
                    name: 'messages',
                    component: () => import('../views/MessagesView.vue'),
                    meta: { moduleId: 'messages' }
                },
                {
                    path: 'inquiries',
                    name: 'inquiries',
                    component: () => import('../views/InquiryListView.vue'),
                    meta: { moduleId: 'tailor-made' }
                },
                {
                    path: 'inquiries/:id',
                    name: 'inquiry-detail',
                    component: () => import('../views/InquiryDetailView.vue'),
                    meta: { moduleId: 'tailor-made' }
                },
                {
                    path: 'modules',
                    name: 'modules',
                    component: () => import('../views/ModulesView.vue')
                },
                {
                    path: 'gallery',
                    name: 'gallery',
                    component: () => import('../views/GalleryView.vue'),
                    meta: { moduleId: 'gallery' }
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('../views/SettingsView.vue')
                },
                {
                    path: 'hotels',
                    name: 'hotels-list',
                    component: () => import('../views/HotelsListView.vue'),
                    meta: { moduleId: 'hotels' }
                },
                {
                    path: 'hotels/create',
                    name: 'hotels-create',
                    component: () => import('../views/HotelCreateView.vue'),
                    meta: { moduleId: 'hotels' }
                },
                {
                    path: 'hotels/edit/:id',
                    name: 'hotels-edit',
                    component: () => import('../views/HotelCreateView.vue'),
                    meta: { moduleId: 'hotels' }
                },
                {
                    path: 'fleet',
                    name: 'admin-fleet',
                    component: () => import('../views/FleetListView.vue')
                },
                {
                    path: 'fleet/create',
                    name: 'fleet-create',
                    component: () => import('../views/FleetCreateView.vue')
                },
                {
                    path: 'fleet/edit/:id',
                    name: 'fleet-edit',
                    component: () => import('../views/FleetCreateView.vue')
                }
            ]
        },

        // Login (Standalone)
        {
            path: '/admin/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: { guestOnly: true }
        }
    ]
})

// Helper to wait for Firebase Auth to initialize
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(auth, (user) => {
            removeListener();
            resolve(user);
        }, reject);
    });
}

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const guestOnly = to.matched.some(record => record.meta.guestOnly)

    const currentUser = await getCurrentUser()

    if (requiresAuth && !currentUser) {
        next('/admin/login')
    } else if (guestOnly && currentUser) {
        next('/admin')
    } else {
        // Role based access
        if (to.path === '/admin/modules') {
            try {
                const profile = await getUserProfile(currentUser.uid)
                if (profile.role !== 'Super Admin') {
                    next('/admin') // Redirect to dashboard if not super admin
                    return
                }
            } catch (e) {
                console.error("Role check failed", e)
                next('/admin')
                return
            }
        }

        // Module Status Check
        const requiredModule = to.matched.find(record => record.meta.moduleId)
        if (requiredModule) {
            try {
                const modules = await getModules()
                const moduleConfig = modules.find(m => m.id === requiredModule.meta.moduleId)
                if (moduleConfig && !moduleConfig.enabled) {
                    // Module is disabled
                    if (to.meta.requiresAuth) {
                        next('/admin')
                    } else {
                        next('/')
                    }
                    return
                }
            } catch (e) {
                console.error("Module check failed", e)
            }
        }

        next()
    }
})

export default router
